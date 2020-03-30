import json
import time
import datetime
import sys
import random
import string
from collections import defaultdict

ZONES = ["RED", "YELLOW", "GREEN", "INDIGO", "BLUE"]
BAYS = list(string.ascii_uppercase)
CONTENTS = ["Canned Fruit", "Canned Meat", "Canned Beans",  "Canned Vegetables",
            "Pasta", "Rice", "Preserve", "UHT Milk",
            "Toiletries", "Baby Products"]
MIN_WEIGHT = 100
MAX_WEIGHT = 10000

MIN_TIME = 0
MAX_TIME = 36
'''

    1. Iterate through zones
        - Add zone to zone json
    2. Iterate through bays
        - Add bay to zone json
        - Assign xPos yPos (position in zone)
    3. Generate random sizes for each bay
    4. Generate trays xSize * ySize times
        - Assign xPos yPos (position in bay)

'''

def main():
    output_zone = []
    output_bay = []
    output_tray = []
    for zone in ZONES:
        height = random.randint(1, 5)
        width = random.randint(1, 5)
        bays = []
        for i, bay in enumerate(BAYS[:height*width]):
            bays.append(bay)
            b_height = random.randint(1, 7)
            b_width = random.randint(1, 7)
            output_bay.append({
                "zone": zone,
                "bay": bay,
                "xVal": i % width,
                "yVal": i // width,
                "xSize": b_width,
                "ySize": b_height
            })

            for j, tray in enumerate(str(x) for x in range(b_width*b_height)):
                future_time = datetime.datetime.now() + datetime.timedelta(days=random.randint(MIN_TIME, MAX_TIME))
                output_tray.append({
                    "zone": zone,
                    "bay": bay,
                    "tray": tray,
                    "contents": random.choice(CONTENTS),
                    "expiry": f"{future_time.month:02d}/{future_time.year}",
                    "weight": random.randint(MIN_WEIGHT, MAX_WEIGHT),
                    "xPos": j % b_width,
                    "yPos": j // b_width
                })

        output_zone.append({
            "zone": zone,
            "height": height,
            "width": width,
            "bays": bays
        })

    write_string = f"[ {','.join(json.dumps(x) for x in output_tray)}]"
    f = open("trays_dummy.json", mode='w')
    f.write(write_string)
    f.close()

    write_string = f"[ {','.join(json.dumps(x) for x in output_bay)}]"
    f = open("bays_dummy.json", mode='w')
    f.write(write_string)
    f.close()

    write_string = f"[ {','.join(json.dumps(x) for x in output_zone)}]"
    f = open("zones_dummy.json", mode='w')
    f.write(write_string)
    f.close()

if __name__ == '__main__':
    main()
    
