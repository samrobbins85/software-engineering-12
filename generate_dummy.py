import json
import time
import sys
import random
from collections import defaultdict

ZONES = ["RED", "YELLOW", "GREEN", "INDIGO", "BLUE", "ORANGE"]
BAYS = list("ABCDEF")
TRAYS = [str(x) for x in range(40)]
CONTENTS = ["Canned Fruit", "Canned Meat", "Canned Beans",  "Canned Vegetables",
            "Pasta", "Rice", "Preserve", "UHT Milk",
            "Toiletries", "Baby Products"]
# WEIGHT = Random int in grams
# Expiry = Random UNIX time date within 2 years

def main(n):
    output = []
    locations_used = defaultdict(lambda: False)
    for _ in range(n):
        while True:
            zone = random.choice(ZONES)
            bay = random.choice(BAYS)
            tray = random.choice(TRAYS)
            if not locations_used[(zone, bay, tray)]:
                locations_used[(zone, bay, tray)] = True
                break

        contents = random.choice(CONTENTS)

        MIN_WEIGHT = 100
        MAX_WEIGHT = 10000
        weight = random.randint(MIN_WEIGHT, MAX_WEIGHT)

        SEC_IN_DAY = 24*60*60
        MIN_TIME = 7*SEC_IN_DAY
        MAX_TIME = 730*SEC_IN_DAY
        expiry = (int(time.time()) + random.randint(MIN_TIME, MAX_TIME))*1000
        
        # TODO: what's all this biz with xPos yPos? <08-03-20, alex> #
        output.append({
            "zone": zone,
            "bay": bay,
            "tray": tray,
            "contents": contents,
            "weight": weight,
            "expiry": expiry
        })

    write_string = f"[ {','.join(json.dumps(x) for x in output)}]"
    f = open("mongodb_dummy.json", mode='w')
    f.write(write_string)
    f.close()

if __name__ == '__main__':
    main(int(sys.argv[1]))
