import Promise from 'bluebird';
import moment from 'moment';
import { partition } from 'lodash';
import db from '../../db';

const Op = db.Sequelize.Op;

async function getExistingEvents(eventAttrs, calendarId) {
  let minDate = moment();

  eventAttrs.forEach(e => {
    if (moment(e.date) < moment(minDate)) {
      minDate = e.date;
    }
  });

  return db.CalendarEvent.findAll({
    where: {
      calendarId,
      date: { [Op.gte]: minDate },
    },
  });
}

export default async (eventAttrs, calendarId) => {
  try {
    const existingEvents = await getExistingEvents(eventAttrs, calendarId);
    const existingEventDates = existingEvents.map(e => e.date);
    const [eventsToUpdateAttrs, eventsToCreateAttrs] = partition(eventAttrs, a =>
      existingEventDates.includes(a.date),
    );

    await Promise.mapSeries(eventsToUpdateAttrs, a =>
      db.CalendarEvent.update(a, {
        where: {
          id: existingEvents.find(e => (e.date = a.date)).id,
        },
      }),
    );

    await db.CalendarEvent.bulkCreate(eventsToCreateAttrs);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('ERROR', e);
    throw e;
  }
};
