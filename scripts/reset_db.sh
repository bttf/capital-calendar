#!/bin/bash
DBNAME="devforums-development"

psql -U postgres -h localhost -p 15432 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid <> pg_backend_pid() AND datname = '${DBNAME}';"

dropdb -U postgres -h localhost -p 15432 $DBNAME
createdb -U postgres -h localhost -p 15432 $DBNAME
