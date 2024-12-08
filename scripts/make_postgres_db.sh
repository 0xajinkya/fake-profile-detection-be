PGPASSWORD=password psql -h 127.0.0.1 -U postgres -c 'CREATE DATABASE sih;' # &> output.txt
PGPASSWORD=password psql -h 127.0.0.1 -U postgres -c 'CREATE DATABASE sih_q;' # &> output.txt
exit 0