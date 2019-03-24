#!/bin/bash
DBNAME="devforums-development"

pg_dump -U postgres -h localhost -p 15432 $DBNAME > snapshot-$(date +"%s")
