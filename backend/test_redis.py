import redis

url = "rediss://default:gQAAAAAAAoJUAAIgcDJkYTBkMDIyY2MyOWI0MTI2OWQxNDRhNjA1OWUxM2E2Yw@composed-seagull-164436.upstash.io:6379?ssl_cert_reqs=none"

print("Connecting...")
r = redis.from_url(url)
print("Pinging...")
result = r.ping()
print("Result:", result)
