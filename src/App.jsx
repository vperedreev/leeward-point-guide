import { useState } from "react";
import {
  Home, Info, MapPin, Car, Key, Wifi, Shield, LogOut, Camera, Wrench,
  ChevronRight, ArrowLeft, Phone, ExternalLink, Star, Check, Clock,
  Utensils, Droplets, Wind, Navigation, Flame, Thermometer, Tv, ZoomIn
} from "lucide-react";

const GOLD  = "#C9A84C";
const TEAL  = "#5B9E98";
const DARK  = "#111A19";
const CARD  = "#1A2523";
const CARD2 = "#1E2D2A";
const BORDER= "#263330";
const MUTED = "#7A9490";

/* ─── REAL PROPERTY PHOTOS ─── */
const P = {
  logo:           "/images/logo.png",
  // Common spaces
  hero:           "/images/view-sunset.jpg",       // pink sunset over waterway — stunning
  entryway:       "/images/entryway.jpg",
  staircase:      "/images/staircase.jpg",
  livingNight:    "/images/living-night.jpg",
  livingNight2:   "/images/living-night2.jpg",
  livingKitchen:  "/images/living-kitchen.jpg",
  kitchenWide:    "/images/kitchen-wide.jpg",
  kitchenIsland:  "/images/kitchen-island.jpg",
  kitchenStove:   "/images/kitchen-stove.jpg",
  gameRoom:       "/images/game-room.jpg",
  bar:            "/images/bar.jpg",
  hotTub:         "/images/hot-tub.jpg",
  // Bedrooms — each room has its own real photo
  masterFront:    "/images/master-front.jpg",       // king, linen headboard, front view — best master shot
  masterWide:     "/images/master-wide.jpg",        // king, linen headboard, wide with desk
  bedChocWide:    "/images/bed-choc-wide.jpg",      // chocolate wingback king, blue bedding, wide
  bedChocClose:   "/images/bed-choc-close.jpg",     // chocolate wingback king, blue bedding, close
  bedTealPaisley: "/images/bed-teal-paisley.jpg",   // teal paisley queen, wood headboard, "Blessed"
  bedTealLove:    "/images/bed-teal-love.jpg",      // same room, wider, "love" wall art
  bedTealWide:    "/images/bed-teal-wide.jpg",      // same room, full angle with TV
  bedSurfFront:   "/images/bed-surf-front.jpg",     // surf baby teal queen, front view, black lamps
  bedSurfBaby:    "/images/bed-surf-baby.jpg",      // surf baby, close angle
  bedSurfAbove:   "/images/bed-surf-above.jpg",     // surf baby, top angle
  bedWhiteBright: "/images/bed-white-bright.jpg",   // white platform queen, bright light
  bedCreamAngle:  "/images/bed-cream-angle.jpg",    // cream queen, ceiling fan angle
  // Bathrooms — each with its real photo
  masterBathWide: "/images/master-bath-wide.jpg",   // master bath, L-vanity, gray cabinets, wide
  masterBathAngle:"/images/master-bath-angle.jpg",  // master bath angle
  bathBlackHex:   "/images/bath-black-hex.jpg",     // black hex floor, double vessel, globe lights
  bathShelves:    "/images/bath-shelves.jpg",        // bathroom shelves, black towels, plant decor
  bathSingleVessel:"/images/bath-single-vessel.jpg",// single vessel, arched mirror, teal towels
  bathPebbleShower:"/images/bath-pebble-shower.jpg",// pebble floor walk-in shower
  bathDoubleSinks:"/images/bathroom.jpg",           // double vessel sinks, arched mirrors, wood vanity
  // Kitchen — night shots are stunning
  kitchenNight:   "/images/kitchen-night.jpg",       // kitchen island at night — best kitchen shot
  kitchenNight2:  "/images/kitchen-night2.jpg",      // kitchen night angle 2
  // Outdoor
  grillReal:      "/images/grill-real.jpg",          // Char-Broil gas grill on screened porch
  outdoorStorage: "/images/outdoor-storage.jpg",     // outdoor deck box + yard
  // Staircase
  staircaseLiving:"/images/staircase-living.jpg",    // staircase with fireplace/living room — best
  staircaseUp:    "/images/staircase-up.jpg",        // staircase going up
  upstairsHall:   "/images/upstairs-hall.jpg",       // upstairs landing + hallway
  staircaseEntry: "/images/staircase-entryway.jpg",  // staircase looking down at front door
  // Surf baby — french doors version
  surfFrenchDoors:"/images/surf-french-doors.jpg",   // surf baby + french doors to patio — best
  surfRoomAngle:  "/images/surf-room-angle.jpg",     // surf baby angle 2
  // Teal bedroom extras
  bedTealTv:      "/images/bed-teal-tv.jpg",         // teal room with rattan dresser + TV
  // White bedroom extras
  bedWhiteDresser:"/images/bed-white-dresser.jpg",   // white room + white dresser side
  // White suite — proper photos
  bedWhiteWide:   "/images/bed-white-wide.jpg",      // white queen, two windows, wide — best
  bedWhiteDay:    "/images/bed-white-day.jpg",       // white queen, ceiling fan, daylight
  bedWhiteFront:  "/images/bed-white-front.jpg",     // white queen, two lamps, front
  bedWhiteCozy:   "/images/bed-white-cozy.jpg",      // white pillows/lamps close
  bedWhiteMirror: "/images/bed-white-mirror.jpg",    // white room with wall mirror
  bedWhiteSmall:  "/images/bed-white-small.jpg",     // smaller white room
  bedWhiteTvOn:   "/images/bed-white-tv-on.jpg",     // white bed with TV on, warm lamps
  // NEW — from project photos
  kitchenMarble:  "/images/kitchen-marble-wide.jpg", // BEST kitchen — marble floor wide angle
  livingDayWide:  "/images/living-day-wide.jpg",     // BEST living room — day, sectional + staircase
  gameBest:       "/images/gameroom-best.jpg",       // BEST game room — pool table + whiskey barrels
  gameNight:      "/images/gameroom-night.jpg",      // Game room night — brick wall + french doors
  barDartboard:   "/images/bar-dartboard.jpg",       // Bar + dartboard + pool cues
  barLed:         "/images/bar-led.jpg",             // Bar at night with LED glow
  livingLed:      "/images/living-led-blue.jpg",     // Living room blue LED overhead
  hottubBest:     "/images/hottub-best.jpg",         // BEST hot tub — clean front
  hottubLounge:   "/images/hottub-lounge-wide.jpg",  // Hot tub + lounge chairs wide
  hottubTop:      "/images/hottub-top.jpg",          // Hot tub top-down
  showerMaster:   "/images/shower-master.jpg",       // Master shower — rain head + body jets + tiles
  masterEve:      "/images/master-eve.jpg",          // Master bedroom evening
  bedChocBest:    "/images/bed-choc-best.jpg",       // Chocolate king best wide shot
  kitchenFridge:  "/images/kitchen-fridge-side.jpg", // Kitchen fridge side + floating shelves
  diningBest:     "/images/dining-best.jpg",         // BEST dining — gold chandelier + abstract art
  diningWide:     "/images/dining-wide.jpg",         // Dining wide angle
  // Pool — FOUND! Screened enclosure, pool + hot tub together
  poolHottubWide: "/images/pool-hottub-wide.jpg",    // BEST — hot tub foreground, pool behind, screened
  poolAction:     "/images/pool-action.jpg",         // Hot tub splashing, pool + game room windows
  // Game room additional angles
  gameroomWide:   "/images/gameroom-wide.jpg",       // Game room wide night
  gameroomDay2:   "/images/gameroom-day2.jpg",       // Game room day, two fans + french doors
  // Living room LED variants
  livingPurple:   "/images/living-purple-led.jpg",   // Living room purple LED
  // Appliances — for how-to guides
  washerControls: "/images/washer-controls.jpg",     // Samsung washer controls
  washerFull:     "/images/washer-full.jpg",         // Samsung washer full
  dryerControls:  "/images/dryer-controls.jpg",      // Samsung dryer controls
  stoveControls:  "/images/stove-controls.jpg",      // LG range controls close-up
  kitchenMicrowave:"/images/kitchen-microwave.jpg",  // Built-in microwave in island
  // Bathroom
  bathDoubleNew:  "/images/bath-double-new.jpg",     // Double bath - wood vanity + arched mirrors
  // Pool
  poolWithHottub: "/images/pool-with-hottub.jpg",    // BEST — hot tub + pool + screened enclosure
  // Living room day
  livingDayBest:  "/images/living-day-best.jpg",     // Best day living — TV wall + fireplace + french doors
  livingFireplace:"/images/living-fireplace.jpg",    // Living fireplace side with beach art
  // Entry detail
  entryTile:      "/images/entryway-tile.jpg",       // Marble diamond tile entry wall
  // Sunset/water views — huge selling point
  viewSunset:     "/images/view-sunset.jpg",         // pink/orange sunset over waterway — hero worthy
  viewDay:        "/images/view-day.jpg",            // daytime water view through blinds
  viewWide:       "/images/view-wide.jpg",           // wide sunset, neighborhood + waterway
  // Bathroom detail
  showerNiche:    "/images/shower-niche.jpg",        // marble circle tile niche, 3 black dispensers
};

const Logo = ({ size = 44 }) => (
  <img src={P.logo} alt="Leeward Retreat" width={size} height={size}
    style={{ borderRadius:"50%", objectFit:"cover", flexShrink:0 }} />
);

/* ─── HOUSE TOUR — every room with its real photo ─── */
const AREAS = [
  {
    id:"entry", label:"Entry & Common Areas", icon:"🏡", cover: P.entryway,
    rooms:[
      { id:"front-door",  label:"Front Entry",         img:P.entryway,      desc:"Stunning entry with a marble geometric tile accent wall, dark navy front door, and a warm wooden console table." },
      { id:"entry-tile",  label:"Entry Tile Wall",      img:P.entryTile,     desc:"The diamond-pattern marble tile accent wall is one of the first things you notice — floor-to-ceiling, with gold accents. An architectural statement that sets the tone for the whole house." },
      { id:"staircase",   label:"Staircase & Living",   img:P.staircaseLiving,desc:"Modern black cable-railing staircase with wood treads. The living room stretches behind with the brick fireplace as the focal point." },
      { id:"living-day",  label:"Living Room",          img:P.livingDayBest, desc:"Bright open living room with large white leather power recliners, fluffy area rug, brick fireplace, and french doors that open into the game room. The whole downstairs flows beautifully." },
      { id:"living-night",label:"Living Room at Night", img:P.livingLed,     desc:"Customizable LED lighting transforms the living room at night — blue, purple, or any color you like. Smart TV, brick fireplace, and plush white sofas." },
    ],
  },
  {
    id:"kitchen", label:"Kitchen & Bar", icon:"🍳", cover: P.kitchenWide,
    rooms:[
      { id:"kitchen-wide",  label:"Kitchen",       img:P.kitchenMarble, desc:"Fully renovated chef's kitchen with gleaming marble floors, white Shaker cabinets, gold hardware, quartz island, bold pendant light, and a full suite of premium appliances." },
      { id:"kitchen-island",label:"Kitchen Island",img:P.kitchenIsland, desc:"Large waterfall island seats 4–5. Velvet barstools on gold pedestals, geometric marble backsplash. Perfect for breakfast, cooking together, or just hanging out." },
      { id:"kitchen-stove", label:"Range & Oven",  img:P.kitchenStove,  desc:"LG electric range with 5 burners, convection oven, and a stunning geometric tile backsplash. All cookware, knives, and utensils are fully stocked." },
      { id:"kitchen-fridge",label:"Kitchen — Fridge Side", img:P.kitchenFridge, desc:"Samsung black stainless French-door fridge with water dispenser. Floating wood shelves with decor. A beautifully designed corner of the kitchen." },
      { id:"dining",        label:"Dining Room",   img:P.diningBest,    desc:"Elegant dining room with a gold Sputnik chandelier, bold abstract art, dark hardwood table, and a dark wood sideboard. Seats 6-8 comfortably." },
      { id:"bar",           label:"Bar Area",      img:P.barDartboard,  desc:"Exposed brick wall bar area with quartz-top island, velvet stools, under-counter fridge, bar sink, dartboard, and pool cues. The ultimate entertainment space." },
    ],
  },
  {
    id:"games", label:"Game Room & Entertainment", icon:"🎱", cover: P.gameBest,
    rooms:[
      { id:"game-day",  label:"Game Room",         img:P.gameBest,     desc:"Incredible game room with a full-size pool table, whiskey barrel side tables, exposed brick walls, wall-mounted TV, dartboard, pool cues, and a full wet bar. The most fun room in the house." },
      { id:"game-wide", label:"Game Room — Full View", img:P.gameroomWide, desc:"The full game room spans a huge open space with two ceiling fans, brick walls all around, and french doors that open directly to the pool area. Perfect day or night." },
      { id:"bar-room",  label:"Bar & Dartboard",   img:P.barDartboard, desc:"Full bar with quartz countertop, under-counter fridge, bar sink, pool cue rack, and dartboard built into the brick wall. You won't need to leave." },
    ],
  },
  {
    id:"pool", label:"Pool & Hot Tub", icon:"🏊", cover: P.poolWithHottub,
    rooms:[
      { id:"pool-main", label:"Pool + Hot Tub",    img:P.poolWithHottub, desc:"Private screened pool enclosure with a sparkling pool and HydroSpa hot tub side by side. Lounge chairs, a huge sky above, and total privacy. Guests' favorite spot at the property." },
      { id:"hottub-main",label:"Hot Tub",          img:P.hottubBest,   desc:"HydroSpa heated hot tub with digital controls. Pre-set to 102°F, seats 6 comfortably, powerful jets throughout. See How-To Guides for step-by-step operating instructions." },
      { id:"hot-lounge", label:"Hot Tub & Lounges",img:P.hottubLounge, desc:"Lounge chairs on the pool deck right beside the hot tub. Soak in the jets, then dry off in the Florida sun. The screened enclosure keeps it bug-free year-round." },
    ],
  },
  {
    id:"master", label:"Master Suite", icon:"👑", cover: P.masterFront,
    rooms:[
      { id:"master-bed",  label:"Master Bedroom",  img:P.masterFront,    desc:"King bedroom with a tall tufted linen headboard, pinch-pleat gray bedding, dual wood nightstands, and a built-in desk nook. Spacious and beautifully quiet." },
      { id:"master-bed2", label:"Master — Wide",   img:P.masterWide,     desc:"The master suite has plenty of space — room for a work desk, large closet, and two ceiling fans for great airflow on Florida nights." },
      { id:"master-bath", label:"Master Bathroom", img:P.masterBathWide, desc:"Large L-shaped master bathroom with gray painted cabinets, dual vessel sinks, wood butcher-block countertop, framed mirrors, and patterned tile floor. Spa-quality." },
      { id:"master-bath2",label:"Master Shower",    img:P.showerMaster,   desc:"Walk-in shower with a matte black rain head, 6-body-jet panel, circle marble tile niche, and premium toiletries provided. A true spa experience." },
    ],
  },
  {
    id:"king-suite", label:"King Suite", icon:"🛏️", cover: P.bedChocWide,
    rooms:[
      { id:"choc-king",   label:"King Bedroom",    img:P.bedChocWide,  desc:"Dramatic king bedroom with a tall chocolate-brown tufted wingback headboard, light blue bedding, rattan-style nightstands, and two bedside lamps. Warm and inviting." },
      { id:"choc-close",  label:"Bed Close-Up",    img:P.bedChocClose, desc:"Quality king mattress dressed in soft blue bedding. Fresh towels placed at arrival. Every bedroom includes its own TV." },
      { id:"bath-black",  label:"Ensuite Bathroom",img:P.bathBlackHex, desc:"Dramatic bathroom with matte black hexagon tile floor, dual vessel sinks on a wood butcher-block vanity, arched mirrors, and exposed-filament globe lights." },
      { id:"bath-shelves",label:"Bath Detail",     img:P.bathShelves,  desc:"Floating wood shelves stocked with fresh black towels, a round vanity mirror, and a live plant. Fully stocked with soap, shampoo, and essentials." },
    ],
  },
  {
    id:"teal-suite", label:"Teal Queen Suite", icon:"🌊", cover: P.bedTealPaisley,
    rooms:[
      { id:"teal-main",   label:"Teal Bedroom",    img:P.bedTealPaisley, desc:"Queen bedroom with gorgeous teal paisley bedding, warm wood platform frame, gold lamp nightstands, and a 'Blessed' accent pillow. Cozy and well-decorated." },
      { id:"teal-wide",   label:"Full Room View",  img:P.bedTealWide,    desc:"The full room shows the TV dresser setup, patterned area rug, and two windows for natural light. A comfortable, complete space." },
      { id:"teal-bath",   label:"Private Bathroom",img:P.bathSingleVessel,desc:"Private bathroom with a single vessel sink on a wood-tone countertop, arched black-frame mirror, black matte faucet, and fresh teal towels. Clean and modern." },
    ],
  },
  {
    id:"surf-suite", label:"Surf Baby Suite", icon:"🏄", cover: P.surfFrenchDoors,
    rooms:[
      { id:"surf-front",  label:"Surf Baby Bedroom",img:P.surfFrenchDoors, desc:"Teal queen bedroom with french doors to the patio — unique and breezy. Industrial black metal frame with rustic wood headboard, a 'Surf Baby' sign, and a large mounted TV." },
      { id:"surf-above",  label:"Room Overview",    img:P.surfRoomAngle,   desc:"Spacious layout with a large dresser, floor lamp, work chair, and great natural light. The french doors open onto the outdoor area." },
    ],
  },
  {
    id:"white-suite", label:"Bright Queen Suite", icon:"☀️", cover: P.bedWhiteWide,
    rooms:[
      { id:"white-wide",   label:"Bright Bedroom",    img:P.bedWhiteWide,   desc:"Sun-drenched queen bedroom with two large windows, white platform frame, neutral linen bedding, and warm tripod lamps on both sides. Light and airy all day." },
      { id:"white-front",  label:"Bed Front View",    img:P.bedWhiteFront,  desc:"Clean front view of the queen bed — plush white bedding, two matching tripod lamps, and decorative pillows. Fresh towels placed at arrival." },
      { id:"white-cozy",   label:"Bedside Detail",    img:P.bedWhiteCozy,   desc:"Warm lamp glow, soft pillows, and a cane nightstand. Every detail is considered for a comfortable stay." },
      { id:"bath-double",  label:"Shared Bathroom",   img:P.bathDoubleSinks,desc:"Beautifully renovated shared bathroom with dual vessel sinks, arched black-frame mirrors, pentagon pendant lights, and a warm wood vanity. Fully stocked." },
      { id:"shower-niche", label:"Shower",            img:P.showerNiche,    desc:"Walk-in shower with a stunning marble circle tile niche, high-end black dispensers stocked with shampoo, conditioner, and body wash." },
    ],
  },
  {
    id:"views", label:"Views & Location", icon:"🌅", cover: P.viewSunset,
    rooms:[
      { id:"sunset-view",  label:"Sunset Over Water",  img:P.viewSunset, desc:"One of the best things about Leeward Retreat — the second floor looks out over a waterway with marsh views and stunning sunsets. This is the view from your room." },
      { id:"day-view",     label:"Waterway View — Day", img:P.viewDay,    desc:"During the day, the upper bedrooms overlook the marsh, waterway, and the Dames Point bridge in the distance. A quiet, scenic Jacksonville neighbourhood." },
      { id:"wide-view",    label:"Neighbourhood at Dusk",img:P.viewWide,  desc:"Wide view at dusk — the Leeward Point neighbourhood sits on a gentle rise overlooking marshland and open water. Peaceful and private." },
    ],
  },
];

/* ─── HOW-TO GUIDES with real appliance photos ─── */
const GUIDES = [
  { id:"hottub",    label:"Hot Tub",        Ico:Droplets,    clr:TEAL,      img:P.hottubBest,
    steps:[
      { t:"Check temperature",  b:"Pre-heated to 100–102°F. Control panel sits on the side ledge of the tub." },
      { t:"Remove the cover",   b:"Lift by handle, rest on the cover lifter. Never leave half-on while in use." },
      { t:"Turn on jets",       b:"Press Jets on the panel. Press again to cycle through intensity levels." },
      { t:"Soak & enjoy",       b:"Max 15–20 min per session. Stay hydrated. No glass. Shower before entering." },
      { t:"Close up when done", b:"Turn jets off, replace cover fully to keep water warm and clean for next time." },
    ]},
  { id:"grill",     label:"Gas Grill",      Ico:Flame,       clr:"#E8863A", img:P.grillReal,
    steps:[
      { t:"Open lid first",     b:"Always open the lid before igniting — never light a closed grill." },
      { t:"Open propane valve", b:"Turn tank valve counterclockwise until fully open." },
      { t:"Turn burner to HIGH",b:"Rotate left burner knob to HIGH position." },
      { t:"Press igniter",      b:"Press the red igniter near the knobs. Flame appears within seconds." },
      { t:"Preheat 10–15 min",  b:"Close lid and preheat on HIGH before placing any food on grates." },
      { t:"Proper shutdown",    b:"Turn all burner knobs off first, then close the propane tank valve." },
    ]},
  { id:"thermostat",label:"Thermostat",     Ico:Thermometer, clr:"#7DC88A", img:P.livingKitchen,
    steps:[
      { t:"Wake the display",   b:"Tap anywhere on the thermostat face to activate." },
      { t:"Select mode",        b:"Press Mode: Cool, Heat, or Auto. In Florida, Cool is almost always correct." },
      { t:"Set temperature",    b:"Use + / − to adjust. We recommend 72–76°F for comfort." },
      { t:"Fan to Auto",        b:"Set fan to Auto so it only runs when actively cooling." },
      { t:"Important",          b:"Keep at 72°F minimum. Below 68°F can strain the system in Florida humidity." },
    ]},
  { id:"kitchen",   label:"Kitchen",        Ico:Utensils,    clr:GOLD,      img:P.stoveControls,
    steps:[
      { t:"Coffee maker",       b:"Add filter and grounds from the pantry cabinet, fill the reservoir, press Brew. Keurig also available." },
      { t:"LG Electric Range",  b:"Turn the burner knob to desired heat level. For oven: press Bake, set temperature with number pad, press Start. Allow 15 min to preheat." },
      { t:"Built-in Microwave", b:"Found inside the kitchen island. Enter time on the number pad, press Start. Add 30 sec button is on the right." },
      { t:"Dishwasher",         b:"Load dishes, place a pod (under the sink) in the soap tray, select Normal cycle, press Start." },
      { t:"Knife block & pans", b:"Full Farberware knife set on the counter. Pots, pans, and bakeware in the lower cabinets." },
      { t:"Pantry items",       b:"Coffee, oil, salt, pepper, sugar, dish soap, paper towels, and basic spices all provided." },
    ]},
  { id:"laundry",   label:"Washer & Dryer", Ico:Wind,        clr:"#6DB3C8", img:P.washerFull,
    steps:[
      { t:"Find the laundry room", b:"Located on the main floor. Samsung front-load washer and dryer, white tile floor." },
      { t:"Washer",             b:"Load clothes, pour liquid detergent into the top tray. Turn dial to Normal. Press and hold Start for 3 seconds to begin." },
      { t:"Washer cycles",      b:"Normal for everyday clothes. Heavy Duty for towels/sheets. Delicates for anything gentle. Quick Wash for lightly-used items (30 min)." },
      { t:"Dryer",              b:"Transfer clothes after washing. Turn dial to Normal. Press and hold Start. Medium heat works for most items." },
      { t:"Dryer cycles",       b:"Normal or Heavy Duty for most loads. Delicates/Air Fluff for gentle items. Wrinkle Prevent adds tumbling after cycle ends." },
      { t:"Supplies",           b:"Detergent and dryer sheets are on the shelf beside the machines. Help yourself." },
      { t:"Checkout request",   b:"Please strip all beds and bring all towels to the laundry room. Starting a wash load is appreciated but not required." },
    ]},
  { id:"tv",        label:"TV & Streaming", Ico:Tv,          clr:"#A084C8", img:P.livingNight,
    steps:[
      { t:"Power on",           b:"Press power on the remote. Smart TV home screen will load." },
      { t:"Browse apps",        b:"Use arrow keys + OK to open Netflix, YouTube, Disney+, and other apps." },
      { t:"Your accounts",      b:"Log in with your own credentials. Just remember to log out before checkout." },
      { t:"Fire TV bedrooms",   b:"Bedrooms have Amazon Fire TV sticks. Use the Fire TV remote to navigate." },
      { t:"HDMI input",         b:"Plug into the HDMI port on the TV side. Press Source/Input on remote to switch." },
    ]},
  { id:"keypad",    label:"Door Keypad",    Ico:Key,         clr:GOLD,      img:P.entryway,
    steps:[
      { t:"Your code",          b:"Personal entry code sent by 11:00 am on check-in day via your booking platform." },
      { t:"Find the door",      b:"Park in back driveway. Walk through screened pool door. First glass door on your left." },
      { t:"Enter code",         b:"Type your code and press checkmark/Enter. The lock clicks open." },
      { t:"Auto-lock",          b:"Door locks automatically after 30 seconds. Press the lock icon to lock manually." },
      { t:"Checkout",           b:"No key to return — your code deactivates at 10:00 am on checkout day." },
    ]},
];

/* ─── LOCAL PLACES ─── */
const PLACES = [
  // ── RESTAURANTS ──────────────────────────────────────────────
  { cat:"eat", e:"🦞", name:"Marker 32",                    area:"Ponte Vedra",       mapq:"Marker 32 Jacksonville FL",        desc:"Waterfront fine dining. Mayport shrimp, grilled octopus. 20+ year Jax staple. Reservations recommended. $$$" },
  { cat:"eat", e:"🥩", name:"Cowford Chophouse",            area:"Downtown Jax",      mapq:"Cowford Chophouse Jacksonville FL", desc:"Steakhouse in a historic bank building with a stunning rooftop bar. Filet mignon + cinnamon roll brûlée. $$$$" },
  { cat:"eat", e:"⭐", name:"Matthew's Restaurant",         area:"San Marco",         mapq:"Matthews Restaurant Jacksonville FL",desc:"James Beard-level fine dining. Innovative New American tasting menus. One of NE Florida's most awarded restaurants. $$$$" },
  { cat:"eat", e:"🐑", name:"Black Sheep",                  area:"Riverside/5 Pts",   mapq:"Black Sheep Jacksonville FL",      desc:"Locally sourced Southern American. Deviled eggs, perfect steak. Lively neighborhood vibe. $$$" },
  { cat:"eat", e:"🥐", name:"Maple Street Biscuit Co.",     area:"San Marco",         mapq:"Maple Street Biscuit San Marco Jacksonville", desc:"The Squawking Goat: fried chicken + goat cheese + pepper jelly on a biscuit. Featured on Food Network. $" },
  { cat:"eat", e:"🦐", name:"Timoti's Seafood Shak",        area:"Five Points",       mapq:"Timotis Seafood Jacksonville FL",  desc:"Wild-caught local seafood done right. Southern style, casual, fresh. Mayport shrimp tacos are legendary. $$" },
  { cat:"eat", e:"🌊", name:"Dockside Seafood",             area:"Jacksonville Beach", mapq:"Dockside Seafood Jacksonville Beach FL", desc:"Mayport shrimp nachos + sunset views over the water. Classic Jax beach seafood spot. $$" },
  { cat:"eat", e:"🏙️", name:"River & Post",                 area:"Downtown Jax",      mapq:"River and Post Jacksonville FL",   desc:"Rooftop restaurant overlooking the St. Johns River skyline. Great cocktails, beautiful at sunset. $$$" },
  { cat:"eat", e:"🦪", name:"Gemma Fish & Oyster",          area:"Downtown Jax",      mapq:"Gemma Fish Oyster Jacksonville FL",desc:"Upscale raw bar, lobster bao buns, chic downtown setting. Perfect for date night. $$$" },
  { cat:"eat", e:"🥩", name:"City Grille & Raw Bar",        area:"Southbank",         mapq:"City Grille Raw Bar Jacksonville FL",desc:"Seafood Tower: Maine lobster, shrimp, oysters. Named one of Florida's top new restaurants. Great Sunday brunch. $$$" },
  { cat:"eat", e:"🍣", name:"Norikase",                     area:"Deerwood",          mapq:"Norikase Jacksonville FL",         desc:"High-end Japanese and sushi. Sake king salmon is a must. One of the best sushi spots in Florida. $$$$" },
  { cat:"eat", e:"🍖", name:"Terra Gaucha",                 area:"Baymeadows",        mapq:"Terra Gaucha Jacksonville FL",     desc:"Brazilian churrascaria — endless cuts of meat carved tableside. Great for groups, big appetites. $$$$" },
  { cat:"eat", e:"🥢", name:"Blue Bamboo",                  area:"Deerwood",          mapq:"Blue Bamboo Jacksonville FL",      desc:"Asian fusion by James Beard-nominated Chef Dennis. Creative, beautiful dishes in a refined setting. $$$" },
  { cat:"eat", e:"🥗", name:"Restaurant Orsay",             area:"Riverside",         mapq:"Restaurant Orsay Jacksonville FL", desc:"French-Southern seasonal menu. Cozy and elegant. One of Jax's most consistently praised restaurants. $$$" },
  { cat:"eat", e:"🌮", name:"TacoLu",                       area:"Jacksonville Beach", mapq:"TacoLu Jacksonville Beach FL",    desc:"Casual, lively outdoor patio. Great tacos, strong margaritas. $$" },
  { cat:"eat", e:"🍖", name:"Jenkins Quality Barbecue",     area:"Multiple locations", mapq:"Jenkins Barbecue Jacksonville FL",desc:"Jacksonville BBQ institution since 1957. Smoked ribs, chopped pork, no-frills perfection. $" },
  { cat:"eat", e:"🥞", name:"Metro Diner",                  area:"Multiple locations", mapq:"Metro Diner Jacksonville FL",     desc:"Massive portions, all-day breakfast. Their pancakes are genuinely ridiculous. Best brunch in Jax. $$" },
  { cat:"eat", e:"🐟", name:"Eleven South",                 area:"Jacksonville Beach", mapq:"Eleven South Jacksonville Beach FL",desc:"Fine dining near the ocean. Cape Cod scallops, rare whiskeys, award-winning wine list. $$$" },
  // ── CAFES & BRUNCH ───────────────────────────────────────────
  { cat:"cafe", e:"☕", name:"Bold Bean Coffee Roasters",   area:"Riverside / Multiple",mapq:"Bold Bean Coffee Jacksonville FL", desc:"Jax's best coffee roaster. Multiple locations. Dog-friendly patios. Get the single-origin pour over." },
  { cat:"cafe", e:"☕", name:"Southern Grounds & Co.",      area:"Neptune Beach",     mapq:"Southern Grounds Neptune Beach FL",desc:"All-day café, great food menu, perfect for remote work or a lazy morning. Beloved local institution." },
  { cat:"cafe", e:"🥐", name:"Le Petit Paris",              area:"Southside",         mapq:"Le Petit Paris Jacksonville FL",   desc:"French bakery. Buttery croissants, proper café au lait. A little slice of Paris in Jax." },
  // ── BARS & NIGHTLIFE ─────────────────────────────────────────
  { cat:"bar", e:"🍺", name:"Intuition Ale Works",          area:"Sports Complex",    mapq:"Intuition Ale Works Jacksonville FL",desc:"Rooftop deck with great views. Game day staple. Solid craft beer lineup." },
  { cat:"bar", e:"🍺", name:"Aardwolf Brewing Co.",         area:"San Marco",         mapq:"Aardwolf Brewing Jacksonville FL",  desc:"The best sours and barrel-aged beers in Jax. Cozy taproom, knowledgeable staff." },
  { cat:"bar", e:"🍺", name:"Bold City Brewery",            area:"Riverside",         mapq:"Bold City Brewery Jacksonville FL", desc:"Classic Jacksonville craft brewery. Huge outdoor space, live music on weekends." },
  { cat:"bar", e:"🏄", name:"Green Room Brewing",           area:"Jacksonville Beach", mapq:"Green Room Brewing Jacksonville Beach FL",desc:"Laid-back surf bar + brewery steps from the beach. Great sunsets." },
  { cat:"bar", e:"🍸", name:"Reve Rooftop Bar",             area:"Downtown Jax",      mapq:"Reve Rooftop Jacksonville FL",      desc:"Rooftop cocktail bar with sweeping city skyline views. Dress up a bit for this one." },
  { cat:"bar", e:"☘️", name:"Culhane's Irish Pub",          area:"Atlantic Beach",    mapq:"Culhanes Irish Pub Atlantic Beach FL",desc:"On Diners, Drive-ins and Dives. Best fish & chips + Reuben in Jax. Great craic, cold pints." },
  // ── BEACHES ──────────────────────────────────────────────────
  { cat:"beach", img:"/images/view-sunset.jpg", e:"🌊", name:"Jacksonville Beach",    area:"20 min east",       mapq:"Jacksonville Beach FL",             desc:"The main Jax beach. Free ocean access, pier, boardwalk, restaurants right on the sand. Paid parking on busy weekends. Great for families." },
  { cat:"beach", img:"/images/view-day.jpg",    e:"🌊", name:"Neptune Beach",         area:"22 min east",       mapq:"Neptune Beach FL",                  desc:"Quieter and more residential than Jax Beach. Free parking on side streets, cleaner vibe, walkable neighborhood with great restaurants nearby." },
  { cat:"beach", img:"/images/view-day.jpg",    e:"🌊", name:"Atlantic Beach",        area:"22 min east",       mapq:"Atlantic Beach FL",                 desc:"Laid-back beach community. Mix of locals and visitors. Dog-friendly sections available. Culhane's Irish Pub is right here." },
  { cat:"beach", img:"/images/view-wide.jpg",   e:"🏖️", name:"Little Talbot Island State Park", area:"25 min north",  mapq:"Little Talbot Island State Park FL",desc:"One of Florida's last undeveloped barrier islands. Wild beach with dunes, maritime forest, $5/vehicle. No crowds, no development — just nature. Bring everything you need." },
  { cat:"beach", img:"/images/view-sunset.jpg", e:"☠️", name:"Big Talbot Island — Boneyard Beach", area:"25 min north", mapq:"Big Talbot Island Boneyard Beach FL",desc:"Famous 'boneyard beach' — ancient driftwood trees bleached white, lying on the sand at water's edge. Eerily beautiful, completely unique. Best photography spot in Northeast Florida." },
  { cat:"beach", img:"/images/view-day.jpg",    e:"🌅", name:"Kathryn Abbey Hanna Park", area:"20 min east",    mapq:"Hanna Park Jacksonville FL",        desc:"850-acre oceanfront park with a lake, 20 miles of trails, BMX course, splash pad, kayak rentals, and a full campground. $5/vehicle. One of the best parks in Florida." },
  // ── PARKS & SIGHTS ───────────────────────────────────────────
  { cat:"sight", e:"🎨", name:"Cummer Museum of Art",       area:"Riverside",         mapq:"Cummer Museum of Art Jacksonville FL",desc:"Stunning riverfront museum with beautiful formal gardens. Free on Tuesdays 4–9pm. Worth a visit on any trip downtown." },
  { cat:"sight", e:"🦁", name:"Jacksonville Zoo & Gardens", area:"North Jax",         mapq:"Jacksonville Zoo Jacksonville FL",  desc:"One of the best zoos in the Southeast. Range of the Jaguar is a highlight. Great for families, half-day activity." },
  { cat:"sight", e:"🐆", name:"Catty Shack Ranch",          area:"North Jax",         mapq:"Catty Shack Ranch Jacksonville FL", desc:"Big cat sanctuary — tigers, lions, leopards. Evening feeding tours are unforgettable. Must book in advance online." },
  { cat:"sight", e:"🎪", name:"Riverside Arts Market",      area:"Riverside",         mapq:"Riverside Arts Market Jacksonville FL",desc:"Every Saturday morning under the Main Street Bridge. Local art, food vendors, live music, food trucks. Free to browse." },
  { cat:"sight", e:"⚓", name:"Kingsley Plantation",        area:"Fort George Island", mapq:"Kingsley Plantation Jacksonville FL",desc:"Oldest plantation house in Florida. Free entry, National Park. Sobering and fascinating history of the region." },
  { cat:"sight", e:"🔭", name:"MOSH Science Museum",        area:"Downtown Jax",      mapq:"Museum of Science History Jacksonville FL",desc:"Museum of Science & History with a planetarium, local history, and interactive exhibits. Great for families and curious adults." },
  // ── TRAILS ───────────────────────────────────────────────────
  { cat:"trail", e:"🚴", name:"Baldwin Rail Trail",         area:"Westside Jax",      mapq:"Baldwin Rail Trail Jacksonville FL", desc:"14.5 miles paved rail trail through shady woods. Flat and easy — perfect for cycling or a long run. Free parking at either end." },
  { cat:"trail", e:"🌲", name:"Hanna Park Trails",          area:"Jax Beach area",    mapq:"Hanna Park Trails Jacksonville FL",  desc:"20 miles of single-track trails through dunes and forest. Rentals available on site. After hiking, walk to the ocean — it's right there." },
  { cat:"trail", e:"⚓", name:"Timucuan Preserve Trails",   area:"North Jax",         mapq:"Timucuan Preserve Jacksonville FL",  desc:"Ancient salt marsh ecosystem. Hiking and paddling trails near Fort Caroline. Incredibly scenic and almost always uncrowded." },
  { cat:"trail", e:"🦅", name:"Little Talbot Island Trails",area:"25 min north",      mapq:"Little Talbot Island Trail FL",      desc:"4-mile loop through maritime forest behind the beach. River otters, bobcats, painted buntings — real wildlife watching on this one." },
  { cat:"trail", e:"🐊", name:"Egans Creek Greenway",       area:"Amelia Island",     mapq:"Egans Creek Greenway Amelia Island FL",desc:"Beautiful greenway trail through Amelia Island marshes. Great for birding and spotting alligators. Free, well-maintained, peaceful." },
  // ── DAY TRIPS ────────────────────────────────────────────────
  { cat:"daytrip", img:"/images/view-sunset.jpg", e:"🏰", name:"St. Augustine",       area:"45 min south",      mapq:"St Augustine FL",                   desc:"America's oldest city (founded 1565). Walk St. George Street, see Castillo de San Marcos fort, St. Augustine Lighthouse, and ghost tours at night. Don't miss: Llama restaurant (Peruvian) and the rooftop bar at River & Fort. Budget a full day — it earns it." },
  { cat:"daytrip", img:"/images/view-wide.jpg",   e:"🏝️", name:"Amelia Island",       area:"45 min north",      mapq:"Amelia Island Fernandina Beach FL",  desc:"13 miles of beaches + charming Victorian downtown Fernandina Beach. Palace Saloon (oldest continuously operating bar in Florida, 1903). Fort Clinch State Park, sunset cruises, local shrimp restaurants. The scenic A1A route through Talbot Islands is half the fun." },
  { cat:"daytrip", img:"/images/view-wide.jpg",   e:"🐎", name:"Cumberland Island, GA",area:"90 min + ferry",   mapq:"Cumberland Island National Seashore GA",desc:"One of America's greatest wild places. Wild horses roam free, zero cars allowed. Ferry departs St. Marys, GA — MUST book ahead at nps.gov. Dungeness Ruins, pristine untouched beaches, Spanish moss trails. JFK Jr. held his secret wedding here. Bring all your own food — nothing available on the island." },
  { cat:"daytrip", img:"/images/view-day.jpg",    e:"🌿", name:"Gainesville & Paynes Prairie",area:"1.5 hrs west",mapq:"Paynes Prairie Preserve State Park FL",desc:"Bison, wild horses, alligators, and sandhill cranes on a 21,000-acre prairie preserve. Florida Museum of Natural History is also here. Great breweries and food in downtown Gainesville. Make a full day of it." },
  // ── SPRINGS ──────────────────────────────────────────────────
  { cat:"springs", img:"/images/pool-action.jpg", e:"🤿", name:"Ginnie Springs",      area:"~90 min west",      mapq:"Ginnie Springs High Springs FL",    desc:"World-famous freshwater cave diving. Jacques Cousteau: 'Visibility forever.' 72°F crystal-clear water year-round. 7 springs on 250 wooded acres. Snorkeling, tubing the Santa Fe River, cave diving, camping. Gear rentals on site. Day pass ~$30. Camp spots book MONTHS ahead — plan early." },
  { cat:"springs", img:"/images/pool-with-hottub.jpg", e:"🏊", name:"Ichetucknee Springs",area:"~90 min west", mapq:"Ichetucknee Springs State Park FL", desc:"Florida's #1 tubing river. Float 6 miles of 68°F spring-fed crystal water in 2–3 hours past turtles, fish, and otters. Arrive EARLY — they cap daily tubers and sell out fast on weekends. Tube rentals on site. $7/person entry. Combine with Ginnie Springs for the perfect springs day." },
  { cat:"springs", img:"/images/pool-action.jpg", e:"🐢", name:"Alexander Springs",   area:"~90 min south",     mapq:"Alexander Springs Altoona FL",      desc:"Best swimming hole in Ocala National Forest. Large sandy-bottom basin, 72°F, incredible snorkeling and scuba (only spring in Ocala NF where scuba is allowed). 7-mile canoe trail through ancient forest. $5.50/person. Check ahead — occasionally closes due to alligator sightings." },
  { cat:"springs", img:"/images/pool-hottub-wide.jpg",  e:"💀", name:"Devil's Den",   area:"~2 hrs",            mapq:"Devils Den Spring Williston FL",    desc:"Underground prehistoric spring cavern in Williston — walk down stairs into a collapsed cave lit by a hole in the ceiling. Ancient fossil beds, 72°F water, max 54ft depth. One of the most unique places in Florida. Reservations required — book online." },
  { cat:"springs", img:"/images/pool-action.jpg", e:"💎", name:"Silver Springs State Park",area:"~90 min",      mapq:"Silver Springs State Park FL",     desc:"Glass-bottom boat tours over natural springs where you can see straight to the bottom — 30+ feet of perfect clarity. Tarzan and other Hollywood films were shot here. Kayak, paddleboard, and hiking trails also available." },
];

const CATS = [
  { id:"all",     label:"All",       e:"✦"  },
  { id:"eat",     label:"Eat",       e:"🍽️" },
  { id:"cafe",    label:"Café",      e:"☕" },
  { id:"bar",     label:"Bars",      e:"🍺" },
  { id:"beach",   label:"Beaches",   e:"🌊" },
  { id:"springs", label:"Springs",   e:"💧" },
  { id:"daytrip", label:"Day Trips", e:"🗺️" },
  { id:"sight",   label:"Sights",    e:"👁️" },
  { id:"trail",   label:"Trails",    e:"🌿" },
];

const INFO_TILES = [
  { id:"arrival",  label:"Arrival",     sub:"Address · parking",       Ico:Car,        clr:"#C9A84C" },
  { id:"checkin",  label:"Check-In",    sub:"Code · 4:00 pm",          Ico:Key,        clr:TEAL      },
  { id:"wifi",     label:"Wi-Fi",       sub:"Network & password",      Ico:Wifi,       clr:"#6DB3C8" },
  { id:"rules",    label:"House Rules", sub:"What to know",            Ico:Shield,     clr:"#D47070" },
  { id:"checkout", label:"Check-Out",   sub:"10:00 am checklist",      Ico:LogOut,     clr:"#A084C8" },
  { id:"local",    label:"Local Area",  sub:"Cafes, bars & more",      Ico:MapPin,     clr:"#7DC88A" },
  { id:"book",     label:"Book Direct", sub:"Save on next stay",       Ico:Star,       clr:GOLD      },
  { id:"tour",     label:"House Tour",  sub:"Every room, real photos", Ico:Camera,     clr:"#C8925A" },
  { id:"howto",    label:"How-To",      sub:"Grill · hot tub · more",  Ico:Wrench,     clr:TEAL      },
];

/* ─── SHARED ─── */
function useCopy(text) {
  const [ok, setOk] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(text); } catch (_) {}
    setOk(true); setTimeout(() => setOk(false), 2000);
  };
  return [ok, copy];
}

function BackBar({ onBack, title, accent }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px 14px", background:DARK, borderBottom:`1px solid ${BORDER}`, position:"sticky", top:0, zIndex:20 }}>
      <button onClick={onBack} style={{ background:CARD2, border:`1px solid ${BORDER}`, color:"#fff", borderRadius:10, padding:"8px 11px", cursor:"pointer", display:"flex" }}>
        <ArrowLeft size={15} />
      </button>
      <span style={{ fontWeight:800, fontSize:17, color:accent||"#fff" }}>{title}</span>
    </div>
  );
}

function SLabel({ text, icon }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:13 }}>
      {icon && <span style={{ fontSize:14 }}>{icon}</span>}
      <span style={{ fontSize:10.5, fontWeight:900, color:TEAL, letterSpacing:"0.18em" }}>{text.toUpperCase()}</span>
    </div>
  );
}

function Card({ children, style, accent }) {
  return <div style={{ background:CARD, border:`1px solid ${accent?accent+"33":BORDER}`, borderRadius:18, padding:"18px 20px", ...style }}>{children}</div>;
}

function Row({ label, val }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${BORDER}` }}>
      <span style={{ color:MUTED, fontSize:13.5 }}>{label}</span>
      <span style={{ fontWeight:700, fontSize:14 }}>{val}</span>
    </div>
  );
}

function THead({ Ico, label, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:16 }}>
      <div style={{ background:color+"22", borderRadius:12, padding:10 }}><Ico size={19} color={color} /></div>
      <span style={{ fontWeight:800, fontSize:17 }}>{label}</span>
    </div>
  );
}

function Steps({ steps, color }) {
  return steps.map(({ t, b }, i) => (
    <div key={i} style={{ display:"flex", gap:14, marginBottom:22 }}>
      <div style={{ background:color, borderRadius:"50%", width:30, height:30, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:color===GOLD?"#1a0e00":"#fff", flexShrink:0, marginTop:2 }}>{i+1}</div>
      <div>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:5 }}>{t}</div>
        <div style={{ color:"#A8BDB8", fontSize:13.5, lineHeight:1.8 }}>{b}</div>
      </div>
    </div>
  ));
}

/* ─── HOME PAGE ─── */
function HomePage({ nav, setTab }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      {/* Hero — blue LED living room shot */}
      <div style={{ position:"relative", height:"72vh", minHeight:460, overflow:"hidden" }}>
        <img src={P.hero} alt="Leeward Retreat" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(170deg, rgba(17,26,25,0.05) 0%, rgba(17,26,25,0.5) 40%, rgba(17,26,25,0.93) 85%)" }} />
        <div style={{ position:"absolute", top:20, left:20 }}>
          <Logo size={56} />
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 24px 32px" }}>
          <div style={{ display:"inline-block", background:GOLD, color:"#1a0e00", fontSize:9.5, fontWeight:900, letterSpacing:"0.22em", padding:"4px 12px", borderRadius:4, marginBottom:14 }}>
            JACKSONVILLE, FL · POOL · HOT TUB · GAME ROOM
          </div>
          <h1 style={{ fontSize:"clamp(28px,8vw,44px)", fontWeight:900, lineHeight:1.05, fontFamily:"Georgia, serif", marginBottom:8 }}>
            Welcome to<br/>Leeward Retreat
          </h1>
          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:14.5, marginBottom:24, fontStyle:"italic" }}>
            5 bedrooms · pool · hot tub · game room · full bar
          </p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <button onClick={() => setTab("info")} style={{ background:GOLD, color:"#1a0e00", border:"none", borderRadius:12, padding:"13px 24px", fontWeight:800, fontSize:14, cursor:"pointer", boxShadow:`0 4px 20px ${GOLD}55` }}>View Guide</button>
            <button onClick={() => setTab("map")} style={{ background:"rgba(91,158,152,0.2)", color:"#fff", border:`1px solid ${TEAL}66`, borderRadius:12, padding:"13px 22px", fontWeight:600, fontSize:14, cursor:"pointer" }}>Local Picks</button>
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div style={{ padding:"22px 20px 0" }}>
        <SLabel text="Quick Info" icon="✦" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:22 }}>
          {[
            { Ico:Clock,  label:"Check-in",  val:"4:00 pm",      clr:TEAL      },
            { Ico:LogOut, label:"Check-out", val:"10:00 am",     clr:"#D47070" },
            { Ico:Wifi,   label:"Wi-Fi",     val:"The Leeward Retreat",  clr:"#6DB3C8" },
            { Ico:Phone,  label:"Host",      val:"216-644-3614", clr:GOLD      },
          ].map(({ Ico, label, val, clr }) => (
            <div key={label} style={{ background:CARD, borderRadius:14, padding:"14px 15px", border:`1px solid ${BORDER}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                <Ico size={12} color={clr} />
                <span style={{ fontSize:9.5, color:MUTED, fontWeight:700, letterSpacing:"0.1em" }}>{label.toUpperCase()}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:14 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real photo grid */}
      <div style={{ padding:"0 20px 0" }}>
        <SLabel text="The Property" icon="🏡" />
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:8, marginBottom:8 }}>
          <img src={P.kitchenNight}   alt="Kitchen"       style={{ width:"100%", height:130, objectFit:"cover", borderRadius:"14px 4px 4px 14px" }} />
          <img src={P.hotTub}        alt="Hot Tub"       style={{ width:"100%", height:130, objectFit:"cover", borderRadius:"4px 14px 14px 4px" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:8, marginBottom:8 }}>
          <img src={P.masterFront}   alt="Master"        style={{ width:"100%", height:110, objectFit:"cover", borderRadius:"14px 4px 4px 14px" }} />
          <img src={P.gameRoom}      alt="Game Room"     style={{ width:"100%", height:110, objectFit:"cover", borderRadius:"4px 14px 14px 4px" }} />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:22 }}>
          <img src={P.viewSunset}     alt="View"          style={{ width:"100%", height:90, objectFit:"cover", borderRadius:12 }} />
          <img src={P.bathBlackHex}  alt="Bathroom"      style={{ width:"100%", height:90, objectFit:"cover", borderRadius:12 }} />
          <img src={P.bedChocWide}   alt="Bedroom"       style={{ width:"100%", height:90, objectFit:"cover", borderRadius:12 }} />
        </div>
      </div>

      {/* Explore links */}
      <div style={{ padding:"0 20px 0" }}>
        <SLabel text="Explore" icon="→" />
        {[
          { id:"tour",  label:"House Tour",    sub:"Every room with your real photos",     img:P.kitchenIsland, clr:TEAL          },
          { id:"howto", label:"How-To Guides", sub:"Hot tub · grill · kitchen & more",     img:P.hotTub,        clr:GOLD          },
          { id:"local", label:"Local Picks",   sub:"Best of Jacksonville, FL",             img:P.gameRoom,      clr:"#7DC88A", isMap:true },
        ].map(({ id, label, sub, img, clr, isMap }) => (
          <button key={id} onClick={() => isMap ? setTab("map") : nav(id)} style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, padding:0, overflow:"hidden", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", width:"100%", marginBottom:10 }}>
            <div style={{ width:90, height:72, flexShrink:0, overflow:"hidden" }}>
              <img src={img} alt={label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div style={{ padding:"0 16px", flex:1 }}>
              <div style={{ fontWeight:800, fontSize:15, color:clr, marginBottom:3 }}>{label}</div>
              <p style={{ fontSize:12, color:MUTED, margin:0 }}>{sub}</p>
            </div>
            <ChevronRight size={15} color={BORDER} style={{ marginRight:15 }} />
          </button>
        ))}
      </div>

      {/* Book banner */}
      <div style={{ margin:"20px 20px 110px" }}>
        <a href="https://ukcrentals.holidayfuture.com" target="_blank" rel="noreferrer"
          style={{ display:"block", background:`linear-gradient(135deg, ${GOLD}, #A07A2A)`, borderRadius:18, padding:"22px 24px", textDecoration:"none" }}>
          <div style={{ fontSize:9.5, fontWeight:900, color:"#3a2200", letterSpacing:"0.18em", marginBottom:5 }}>BOOK DIRECT · BEST PRICE GUARANTEED</div>
          <div style={{ fontWeight:900, fontSize:20, color:"#1a0e00", fontFamily:"Georgia, serif", marginBottom:4 }}>Plan your next stay</div>
          <div style={{ fontSize:12.5, color:"#5a4000" }}>ukcrentals.holidayfuture.com →</div>
        </a>
      </div>
    </div>
  );
}

/* ─── INFO PAGE ─── */
function InfoPage({ nav, setTab }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh", padding:"24px 20px 110px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <Logo size={42} />
        <div>
          <SLabel text="Your Guide" />
          <h1 style={{ fontSize:24, fontWeight:900, fontFamily:"Georgia, serif", marginTop:-6 }}>Information</h1>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:11 }}>
        {INFO_TILES.map(({ id, label, sub, Ico, clr }) => (
          <button key={id} onClick={() => id==="local" ? setTab("map") : nav(id)}
            style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:18, padding:"18px 8px 16px", cursor:"pointer", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:10, width:"100%" }}>
            <div style={{ background:clr+"1A", borderRadius:14, padding:12 }}><Ico size={22} color={clr} /></div>
            <div>
              <div style={{ fontWeight:800, fontSize:11.5, lineHeight:1.3 }}>{label}</div>
              <div style={{ fontSize:9.5, color:MUTED, marginTop:3, lineHeight:1.4 }}>{sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── ARRIVAL ─── */
function ArrivalPage({ back }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="Arrival & Parking" accent={GOLD} />
      <div style={{ position:"relative", height:200, overflow:"hidden" }}>
        <img src={P.entryway} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(17,26,25,0.9))" }} />
      </div>
      <div style={{ padding:"22px 20px 110px" }}>
        <Card style={{ marginBottom:12 }}>
          <THead Ico={MapPin} label="Address" color={GOLD} />
          <div style={{ fontWeight:900, fontSize:19, fontFamily:"Georgia, serif", marginBottom:3 }}>4151 Leeward Point</div>
          <div style={{ color:MUTED, fontSize:14, marginBottom:18 }}>Jacksonville, FL 32225</div>
          <a href="https://maps.apple.com/?q=4151+Leeward+Point+Jacksonville+FL" target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:8, background:TEAL, color:"#fff", borderRadius:10, padding:"10px 18px", textDecoration:"none", fontWeight:700, fontSize:13 }}>
            <Navigation size={14} /> Open in Maps
          </a>
        </Card>
        <Card>
          <THead Ico={Car} label="Parking" color={GOLD} />
          {["Use the back driveway by the garage.","Do not block the neighbors' driveways.","Walk through the screened pool door.","Enter the first glass door on your left."].map((s,i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ background:TEAL, color:"#fff", borderRadius:"50%", width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:12, flexShrink:0 }}>{i+1}</div>
              <p style={{ color:"#B8CECC", fontSize:14, lineHeight:1.65, margin:0 }}>{s}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ─── CHECK-IN ─── */
function CheckInPage({ back }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="Check-In" accent={TEAL} />
      <div style={{ padding:"22px 20px 110px" }}>
        <Card style={{ marginBottom:12 }}>
          <THead Ico={Clock} label="Stay Times" color={TEAL} />
          <Row label="Check-in from" val="4:00 pm" />
          <Row label="Check-out by"  val="10:00 am" />
          <Row label="Code arrives"  val="by 11am on arrival day" />
        </Card>
        <Card style={{ marginBottom:12 }}>
          <THead Ico={Key} label="Entry Steps" color={TEAL} />
          {["Park in the back driveway by the garage.","Walk through the screened pool door.","Go to the first glass door on your left.","Enter your code on the digital keypad."].map((s,i) => (
            <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:`1px solid ${BORDER}` }}>
              <div style={{ background:TEAL, color:"#fff", borderRadius:"50%", width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, flexShrink:0 }}>{i+1}</div>
              <p style={{ color:"#B8CECC", fontSize:14, lineHeight:1.65, margin:0 }}>{s}</p>
            </div>
          ))}
          <div style={{ background:"#0d1e1d", borderRadius:10, padding:"13px 15px", marginTop:16, border:`1px solid ${TEAL}33` }}>
            <div style={{ color:TEAL, fontWeight:800, fontSize:13, marginBottom:4 }}>📲 Access code</div>
            <p style={{ color:"#9BBFBB", fontSize:13, lineHeight:1.7, margin:0 }}>Sent by <strong>11:00 am</strong> on check-in day. Check your messages from the booking platform or host directly.</p>
          </div>
        </Card>
        <Card>
          <THead Ico={Phone} label="Host Contact" color={TEAL} />
          <Row label="Phone" val="216-644-3614" />
          <Row label="Email" val="ukcrentals@gmail.com" />
        </Card>
      </div>
    </div>
  );
}

/* ─── WIFI ─── */
function WifiPage({ back }) {
  const [okN, cpN] = useCopy("The Leeward Retreat");
  const [okP, cpP] = useCopy("9niner67");
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="Wi-Fi" accent="#6DB3C8" />
      <div style={{ padding:"28px 20px 110px" }}>
        <div style={{ background:"#0a1c1e", borderRadius:22, padding:"28px 24px", border:`1px solid ${TEAL}33`, textAlign:"center", marginBottom:16 }}>
          <Wifi size={40} color={TEAL} style={{ marginBottom:10 }} />
          <h2 style={{ fontSize:22, fontWeight:900, fontFamily:"Georgia, serif", marginBottom:6 }}>Connect to Wi-Fi</h2>
          <p style={{ color:MUTED, fontSize:13.5, marginBottom:24 }}>Scan the QR code to connect instantly — or tap to copy below</p>

          {/* QR Code */}
          <div style={{ background:"#fff", borderRadius:18, padding:16, display:"inline-block", marginBottom:24, boxShadow:"0 4px 24px rgba(0,0,0,0.4)" }}>
            <img src="/images/wifi-qr.png" alt="Wi-Fi QR Code" style={{ width:180, height:180, display:"block", objectFit:"contain" }} />
          </div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:20 }}>📱 Open your phone camera and point at the code above</div>

          {/* Manual tap-to-copy */}
          {[
            { label:"NETWORK",  val:"The Leeward Retreat", ok:okN, cp:cpN, clr:TEAL },
            { label:"PASSWORD", val:"9niner67",            ok:okP, cp:cpP, clr:GOLD },
          ].map(({ label, val, ok, cp, clr }) => (
            <div key={label} style={{ background:"#111f1d", borderRadius:14, padding:"16px 18px", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${BORDER}` }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:9.5, color:MUTED, letterSpacing:"0.1em", marginBottom:6 }}>{label}</div>
                <div style={{ fontWeight:800, fontSize:18, fontFamily:"monospace", color:clr }}>{val}</div>
              </div>
              <button onClick={cp} style={{ background:ok?TEAL+"22":CARD2, border:`1px solid ${ok?TEAL:BORDER}`, color:ok?TEAL:"#888", borderRadius:9, padding:"9px 16px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                {ok ? "✓ Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ background:CARD, borderRadius:14, padding:"14px 18px", border:`1px solid ${BORDER}`, textAlign:"center" }}>
          <div style={{ fontSize:13, color:MUTED, lineHeight:1.7 }}>High-speed Wi-Fi throughout the home including the game room and all bedrooms. Dedicated workspace available in the master suite.</div>
        </div>
      </div>
    </div>
  );
}

/* ─── RULES ─── */
function RulesPage({ back }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="House Rules & Safety" accent="#D47070" />
      <div style={{ padding:"22px 20px 110px" }}>

        <Card style={{ marginBottom:12 }}>
          <THead Ico={Shield} label="House Rules" color="#D47070" />
          {[
            { e:"👥", t:"10 guests maximum",  d:"Registered guests only — no unannounced visitors" },
            { e:"🔇", t:"Quiet hours",        d:"11:00 pm – 7:00 am" },
            { e:"🚭", t:"No smoking",         d:"Anywhere on the property indoors or outdoors" },
            { e:"🐾", t:"No pets",            d:"Not permitted" },
            { e:"🎉", t:"No parties",         d:"Gatherings must stay within the guest count" },
            { e:"🏊", t:"Pool & hot tub",     d:"No diving · shower before entering · no glass near pool" },
            { e:"🌡️", t:"AC minimum",         d:"Keep at 72°F or above — Florida humidity is hard on the system" },
            { e:"🔒", t:"Lock up when out",   d:"Lock all doors every time you leave" },
          ].map(({ e, t, d }) => (
            <div key={t} style={{ display:"flex", gap:13, padding:"12px 0", borderBottom:`1px solid ${BORDER}`, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, marginTop:1 }}>{e}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{t}</div>
                <div style={{ color:MUTED, fontSize:13, marginTop:2 }}>{d}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom:12 }}>
          <THead Ico={Shield} label="Before You Leave" color="#D47070" />
          {[
            { e:"🛏️", t:"Strip all beds",      d:"Remove linens and bring to the laundry room" },
            { e:"🧺", t:"Gather all towels",   d:"All used towels to the laundry room" },
            { e:"🫧", t:"Start a wash",         d:"Starting the washer before you go is appreciated" },
            { e:"🗑️", t:"Take out trash",       d:"Bag all trash and take to the outdoor bins" },
            { e:"💡", t:"Turn off everything", d:"All lights, ceiling fans, and TVs" },
            { e:"🌡️", t:"Set AC to 76°F",      d:"Before you leave" },
            { e:"🔐", t:"Lock all doors",      d:"Including the game room patio door" },
          ].map(({ e, t, d }) => (
            <div key={t} style={{ display:"flex", gap:13, padding:"12px 0", borderBottom:`1px solid ${BORDER}`, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, marginTop:1 }}>{e}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{t}</div>
                <div style={{ color:MUTED, fontSize:13, marginTop:2 }}>{d}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom:12 }}>
          <THead Ico={Shield} label="What's Included" color={TEAL} />
          {[
            { e:"🛁", t:"Bathrooms",           d:"Shampoo, conditioner, body soap, shower gel, hair dryer, bathtub, bidet, hot water" },
            { e:"🛏️", t:"Bedrooms",            d:"Bed linens, extra pillows & blankets, room-darkening shades, hangers, iron, safe" },
            { e:"🍳", t:"Kitchen",             d:"Fully stocked — cookware, pots & pans, wine glasses, cooking basics, dining table" },
            { e:"📺", t:"Entertainment",       d:"Smart TVs in every room, pool table, Fire TV sticks, Ethernet connection" },
            { e:"❄️", t:"Climate",             d:"Central A/C & heating, indoor fireplace, ceiling fans throughout" },
            { e:"🔥", t:"Outdoor",             d:"BBQ grill, outdoor furniture, pool, hot tub, lounge chairs" },
            { e:"🚗", t:"Parking",             d:"Free parking on premises — driveway fits multiple vehicles" },
            { e:"💼", t:"Work friendly",       d:"High-speed Wi-Fi, dedicated workspace in master suite, Ethernet" },
          ].map(({ e, t, d }) => (
            <div key={t} style={{ display:"flex", gap:13, padding:"12px 0", borderBottom:`1px solid ${BORDER}`, alignItems:"flex-start" }}>
              <span style={{ fontSize:20, marginTop:1 }}>{e}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{t}</div>
                <div style={{ color:MUTED, fontSize:13, marginTop:2 }}>{d}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ marginBottom:12 }} accent="#888">
          <THead Ico={Shield} label="Security Cameras" color="#888" />
          <div style={{ color:MUTED, fontSize:13, lineHeight:1.7 }}>
            For the safety of all guests, the property has exterior security cameras at the front door, back entrance, driveway, and pool area. <strong style={{ color:"#ccc" }}>No cameras are inside the home.</strong>
          </div>
        </Card>

        <Card accent="#D47070">
          <THead Ico={Phone} label="Emergency" color="#D47070" />
          <div style={{ background:"#1c0a0a", borderRadius:10, padding:"14px 16px", border:"1px solid #5f1e1e", marginBottom:14 }}>
            <div style={{ fontWeight:900, color:"#f87171", fontSize:17 }}>🚨 Emergency — call 911</div>
          </div>
          <div style={{ color:MUTED, fontSize:13, marginBottom:14 }}>Property has smoke alarms, carbon monoxide detector, fire extinguisher, and first aid kit.</div>
          <Row label="Host phone" val="216-644-3614" />
          <Row label="Host email" val="ukcrentals@gmail.com" />
        </Card>
      </div>
    </div>
  );
}

/* ─── CHECKOUT ─── */
function CheckoutPage({ back }) {
  const items = [
    "Strip all bed linens and towels, leave in laundry room",
    "Start a wash cycle if you have time",
    "Take trash bags out to the outdoor bins",
    "Turn off all lights and ceiling fans",
    "Set the AC to 76°F",
    "Close and lock all windows",
    "Lock all doors when you leave",
  ];
  const [done, setDone] = useState({});
  const toggle = i => setDone(p => ({ ...p, [i]: !p[i] }));
  const count = Object.values(done).filter(Boolean).length;
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="Check-Out" accent="#A084C8" />
      <div style={{ padding:"22px 20px 110px" }}>
        <div style={{ background:"#110e1c", borderRadius:20, padding:"26px 24px", border:"1px solid #2d1a5e", marginBottom:16, textAlign:"center" }}>
          <LogOut size={38} color="#A084C8" style={{ marginBottom:10 }} />
          <div style={{ fontWeight:900, fontSize:22, fontFamily:"Georgia, serif" }}>Check-out by 10:00 am</div>
          <div style={{ color:MUTED, fontSize:14, marginTop:5, marginBottom:20 }}>Complete these before you go</div>
          <div style={{ background:"#1e1a2e", borderRadius:100, height:8, overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(to right, #A084C8, #C8A4F0)", height:"100%", width:`${Math.round(count/items.length*100)}%`, borderRadius:100, transition:"width 0.35s ease" }} />
          </div>
          <div style={{ fontSize:13, color:"#A084C8", marginTop:9, fontWeight:700 }}>{count} of {items.length} done {count===items.length?"🎉":""}</div>
        </div>
        <div style={{ background:CARD, borderRadius:18, overflow:"hidden", border:`1px solid ${BORDER}` }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => toggle(i)} style={{ display:"flex", gap:13, padding:"15px 18px", width:"100%", background:"none", border:"none", borderBottom:i<items.length-1?`1px solid ${BORDER}`:"none", cursor:"pointer", textAlign:"left", alignItems:"center" }}>
              <div style={{ width:24, height:24, borderRadius:7, border:`2px solid ${done[i]?"#A084C8":"#334"}`, background:done[i]?"#A084C8":"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
                {done[i] && <Check size={14} color="#fff" />}
              </div>
              <span style={{ fontSize:14, color:done[i]?MUTED:"#D4DDD8", textDecoration:done[i]?"line-through":"none" }}>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BOOK ─── */
function BookPage({ back }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="Book Direct" accent={GOLD} />
      <div style={{ padding:"24px 20px 110px" }}>
        <div style={{ background:"#131000", borderRadius:22, padding:"36px 24px", border:`1px solid ${GOLD}33`, textAlign:"center", marginBottom:20 }}>
          <Logo size={64} />
          <h2 style={{ fontSize:22, fontWeight:900, fontFamily:"Georgia, serif", marginBottom:10, marginTop:16 }}>Book your next stay direct</h2>
          <p style={{ color:"#B8A870", fontSize:14, lineHeight:1.8, marginBottom:26 }}>Skip platform fees. Same home, same host — best possible price.</p>
          <a href="https://ukcrentals.holidayfuture.com" target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:9, background:GOLD, color:"#1a0e00", borderRadius:14, padding:"14px 30px", textDecoration:"none", fontWeight:900, fontSize:15, boxShadow:`0 4px 24px ${GOLD}44` }}>
            <ExternalLink size={16} /> Book at Best Price
          </a>
        </div>
        {[
          { e:"💰", t:"No platform fees",    d:"Pay base price directly. No 15% service fees at checkout." },
          { e:"📱", t:"Direct support",      d:"Reach the host straight away. Faster and simpler." },
          { e:"⭐", t:"Loyalty perks",       d:"Returning direct guests get preferred pricing." },
        ].map(({ e, t, d }) => (
          <div key={t} style={{ background:CARD, borderRadius:14, padding:"16px 18px", marginBottom:10, border:`1px solid ${BORDER}`, display:"flex", gap:14 }}>
            <span style={{ fontSize:24 }}>{e}</span>
            <div>
              <div style={{ fontWeight:800, fontSize:15, marginBottom:3 }}>{t}</div>
              <div style={{ color:MUTED, fontSize:13, lineHeight:1.65 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── HOUSE TOUR ─── */
function HouseTourPage({ back, nav }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="House Tour" accent="#C8925A" />
      <div style={{ padding:"16px 20px 110px" }}>
        <p style={{ color:MUTED, fontSize:14, marginBottom:22, lineHeight:1.7 }}>Tap any room to see photos and details.</p>
        {AREAS.map(area => (
          <div key={area.id} style={{ marginBottom:28 }}>
            <SLabel text={area.label} icon={area.icon} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
              {area.rooms.map(room => (
                <button key={room.id} onClick={() => nav("room", { area, room })}
                  style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:16, overflow:"hidden", cursor:"pointer", textAlign:"left", padding:0 }}>
                  <div style={{ position:"relative", height:110 }}>
                    <img src={room.img} alt={room.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))" }} />
                    <div style={{ position:"absolute", bottom:8, right:8, background:"rgba(255,255,255,0.12)", borderRadius:6, padding:"3px 7px" }}>
                      <ZoomIn size={11} color="#fff" />
                    </div>
                  </div>
                  <div style={{ padding:"10px 13px 12px" }}>
                    <div style={{ fontWeight:800, fontSize:12.5 }}>{room.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomDetailPage({ back, area, room }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title={room.label} accent={TEAL} />
      <div style={{ position:"relative", height:320, overflow:"hidden" }}>
        <img src={room.img} alt={room.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 50%, rgba(17,26,25,0.95))" }} />
        <div style={{ position:"absolute", bottom:22, left:22 }}>
          <div style={{ fontSize:10, color:TEAL, fontWeight:900, letterSpacing:"0.15em", marginBottom:6 }}>{area.icon} {area.label.toUpperCase()}</div>
          <h2 style={{ fontSize:26, fontWeight:900, fontFamily:"Georgia, serif" }}>{room.label}</h2>
        </div>
      </div>
      <div style={{ padding:"24px 20px 110px" }}>
        <p style={{ color:"#B8CECC", fontSize:15, lineHeight:1.9 }}>{room.desc}</p>
      </div>
    </div>
  );
}

/* ─── HOW-TO ─── */
function HowToPage({ back, nav }) {
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title="How-To Guides" accent={TEAL} />
      <div style={{ padding:"16px 20px 110px" }}>
        <p style={{ color:MUTED, fontSize:14, marginBottom:22 }}>Step-by-step instructions for every appliance and feature.</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {GUIDES.map(({ id, label, Ico, clr, img }) => (
            <button key={id} onClick={() => nav("guide", id)}
              style={{ background:CARD, border:`1px solid ${BORDER}`, borderRadius:18, overflow:"hidden", cursor:"pointer", textAlign:"left", padding:0, width:"100%" }}>
              <div style={{ position:"relative", height:105 }}>
                <img src={img} alt={label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(17,26,25,0.7))" }} />
                <div style={{ position:"absolute", top:10, right:10, background:clr+"33", borderRadius:8, padding:"5px 7px", border:`1px solid ${clr}44` }}>
                  <Ico size={13} color={clr} />
                </div>
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontWeight:800, fontSize:13 }}>{label}</div>
                <div style={{ fontSize:11, color:MUTED, marginTop:3 }}>{GUIDES.find(g=>g.id===id)?.steps?.length} steps</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GuideDetailPage({ back, guideId }) {
  const g = GUIDES.find(x => x.id === guideId);
  if (!g) return null;
  return (
    <div style={{ background:DARK, minHeight:"100vh" }}>
      <BackBar onBack={back} title={g.label} />
      <div style={{ position:"relative", height:240 }}>
        <img src={g.img} alt={g.label} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 20%, rgba(17,26,25,0.97))" }} />
        <div style={{ position:"absolute", bottom:22, left:20, display:"flex", alignItems:"center", gap:13 }}>
          <div style={{ background:g.clr, borderRadius:13, padding:12 }}><g.Ico size={22} color={g.clr===GOLD?"#1a0e00":"#fff"} /></div>
          <h1 style={{ fontSize:24, fontWeight:900, fontFamily:"Georgia, serif" }}>{g.label}</h1>
        </div>
      </div>
      <div style={{ padding:"24px 20px 110px" }}>
        <Steps steps={g.steps} color={g.clr} />
      </div>
    </div>
  );
}

/* ─── MAP ─── */
function MapPage() {
  const [cat, setCat] = useState("all");
  const list = cat==="all" ? PLACES : PLACES.filter(p => p.cat===cat);
  return (
    <div style={{ background:DARK, minHeight:"100vh", paddingBottom:110 }}>
      <div style={{ padding:"24px 20px 14px" }}>
        <Logo size={38} />
        <div style={{ marginTop:14 }}>
          <SLabel text="Jacksonville, FL" icon="📍" />
          <h1 style={{ fontSize:24, fontWeight:900, fontFamily:"Georgia, serif", marginTop:-4 }}>Local Picks</h1>
          <p style={{ color:MUTED, fontSize:13.5, marginTop:5 }}>{PLACES.length} hand-picked recommendations</p>
        </div>
      </div>
      <div style={{ overflowX:"auto", padding:"0 20px 18px", display:"flex", gap:8 }}>
        {CATS.map(({ id, label, e }) => (
          <button key={id} onClick={() => setCat(id)} style={{ background:cat===id?TEAL:CARD2, color:cat===id?"#fff":"#9BBFBB", border:`1px solid ${cat===id?TEAL:BORDER}`, borderRadius:999, padding:"7px 15px", fontSize:13, fontWeight:cat===id?700:400, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
            {e} {label}
          </button>
        ))}
      </div>
      <div style={{ padding:"0 20px" }}>
        {list.map((p, i) => (
          <div key={i} style={{ background:CARD, borderRadius:15, marginBottom:10, border:`1px solid ${BORDER}`, overflow:"hidden" }}>
            {p.img && <img src={p.img} alt={p.name} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }} />}
            <div style={{ padding:"13px 15px", display:"flex", gap:12 }}>
              <div style={{ fontSize:22, lineHeight:1, marginTop:2, flexShrink:0 }}>{p.e}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>{p.name}</div>
                <div style={{ fontSize:11.5, color:TEAL, fontWeight:700, marginBottom:5 }}>{p.area}</div>
                <div style={{ fontSize:12.5, color:"#9BBFBB", lineHeight:1.6 }}>{p.desc}</div>
              </div>
              <a href={`https://maps.apple.com/?q=${encodeURIComponent(p.name+" Jacksonville FL")}`} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", color:GOLD, flexShrink:0 }}>
                <Navigation size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"18px 20px 0" }}>
        <SLabel text="Quick Picks by Mood" icon="⚡" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {[
            { e:"🤿", t:"Diving or tubing",      r:"Ginnie Springs or Ichetucknee" },
            { e:"🌅", t:"Sunset with drinks",    r:"River & Post or Reve Rooftop"  },
            { e:"🏝️", t:"Full day coastal trip", r:"Amelia Island or Little Talbot"},
            { e:"🏰", t:"History + great food",  r:"St. Augustine — full day"      },
            { e:"🐎", t:"Wild & remote",         r:"Cumberland Island by ferry"    },
            { e:"🦐", t:"Local seafood",         r:"Marker 32 or Timoti's Shak"   },
          ].map(({ e, t, r }) => (
            <div key={t} style={{ background:CARD, borderRadius:14, padding:14, border:`1px solid ${BORDER}` }}>
              <div style={{ fontSize:20, marginBottom:7 }}>{e}</div>
              <div style={{ fontWeight:800, fontSize:13, marginBottom:4 }}>{t}</div>
              <div style={{ fontSize:12, color:MUTED }}>{r}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BOTTOM NAV ─── */
function BottomNav({ active, setTab }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, maxWidth:480, margin:"0 auto", background:"rgba(17,26,25,0.97)", borderTop:`1px solid ${BORDER}`, display:"flex", zIndex:100 }}>
      {[{ id:"home", label:"Home", Ico:Home }, { id:"info", label:"Info", Ico:Info }, { id:"map", label:"Map", Ico:MapPin }].map(({ id, label, Ico }) => (
        <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:"13px 0 15px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <Ico size={21} color={active===id?TEAL:"#3D5551"} strokeWidth={active===id?2.5:1.5} />
          <span style={{ fontSize:9.5, fontWeight:active===id?800:400, color:active===id?TEAL:"#3D5551", letterSpacing:"0.1em" }}>{label.toUpperCase()}</span>
          {active===id && <div style={{ width:4, height:4, borderRadius:"50%", background:TEAL, marginTop:-2 }} />}
        </button>
      ))}
    </div>
  );
}

/* ─── ROOT ─── */
export default function App() {
  const [tab, setTab]     = useState("home");
  const [stack, setStack] = useState([]);
  const cur = stack.length > 0 ? stack[stack.length-1] : null;
  const nav       = (page, params=null) => setStack(s => [...s, { page, params }]);
  const back      = () => setStack(s => s.slice(0,-1));
  const switchTab = t => { setStack([]); setTab(t); };

  const renderPage = () => {
    if (cur) {
      const { page, params } = cur;
      if (page==="arrival")  return <ArrivalPage back={back} />;
      if (page==="checkin")  return <CheckInPage back={back} />;
      if (page==="wifi")     return <WifiPage back={back} />;
      if (page==="rules")    return <RulesPage back={back} />;
      if (page==="checkout") return <CheckoutPage back={back} />;
      if (page==="book")     return <BookPage back={back} />;
      if (page==="tour")     return <HouseTourPage back={back} nav={nav} />;
      if (page==="room")     return <RoomDetailPage back={back} area={params.area} room={params.room} />;
      if (page==="howto")    return <HowToPage back={back} nav={nav} />;
      if (page==="guide")    return <GuideDetailPage back={back} guideId={params} />;
    }
    if (tab==="home") return <HomePage nav={nav} setTab={switchTab} />;
    if (tab==="info") return <InfoPage nav={nav} setTab={switchTab} />;
    if (tab==="map")  return <MapPage />;
  };

  return (
    <div style={{ background:DARK, color:"#fff", fontFamily:"Georgia, serif", maxWidth:480, margin:"0 auto", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:#111A19;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        button{transition:opacity 0.1s;}
        button:active{opacity:0.7;transform:scale(0.98);}
        img{-webkit-user-drag:none;user-select:none;display:block;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:#263330;border-radius:2px;}
        a{color:inherit;}
      `}</style>
      <div key={cur?cur.page+(cur.params?.room?.id||cur.params||""):tab} style={{ animation:"fadeUp 0.25s ease both" }}>
        {renderPage()}
      </div>
      {!cur && <BottomNav active={tab} setTab={switchTab} />}
    </div>
  );
}
