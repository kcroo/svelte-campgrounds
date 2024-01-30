FROM postgis:14

RUN apt-get update && \
  apt-get install -y --no-install-recommends \
  wget \
  postgresql-14-pgrouting && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./initdb-pgrouting.sh /docker-entrypoint-initdb.d/routing.sh