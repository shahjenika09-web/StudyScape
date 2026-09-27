export type WeatherKind =
  | "clear"
  | "cloudy"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "fog"
  | "windy";

export type TimeOfDay =
  | "sunrise"
  | "morning"
  | "afternoon"
  | "golden"
  | "sunset"
  | "night"
  | "midnight";

export type RoomFeature = "fireplace" | "candles" | "deskLamp" | "window";

export type OutdoorKind =
  | "garden"
  | "forest"
  | "city"
  | "mountains"
  | "snowfield"
  | "stars"
  | "canopy"
  | "blossom";

export type WindowShape = "rect" | "arch" | "round" | "shoji" | "portal";

export interface WindowRegion {
  id: string;
  /** all values are percentages of the scene box */
  x: number;
  y: number;
  w: number;
  h: number;
  shape: WindowShape;
  /** grid of glazing bars drawn over the glass */
  mullions?: { rows: number; cols: number };
  /** parallax depth for the outdoor scenery, 0.5 = far, 1 = near */
  depth?: number;
}

export type PropKind =
  | "desk"
  | "shelf"
  | "bookcase"
  | "bookStack"
  | "plant"
  | "futon"
  | "bed"
  | "nightstand"
  | "rug"
  | "counter"
  | "menuBoard"
  | "wallShelf"
  | "cafeSet"
  | "banquette"
  | "sign"
  | "pendant"
  | "telescope"
  | "orrery"
  | "starChart"
  | "stack"
  | "lantern"
  | "stoneLantern"
  | "logs"
  | "cat"
  | "armchair"
  | "sideTable"
  | "globe"
  | "ladder"
  | "floatingBook"
  | "hangingPlant"
  | "tokonoma"
  | "cushion"
  | "curtains"
  | "frames"
  | "fairyLights"
  | "skis"
  | "hangingLantern"
  | "windChime"
  | "leaves";

export interface RoomProp {
  kind: PropKind;
  x: number;
  y: number;
  scale?: number;
  /** picks between looks of the same kind (book colours, plant species, table contents…) */
  variant?: string;
  /** mirror horizontally */
  flip?: boolean;
  /** "front" props are drawn after the avatar (keep them to the edges of the scene) */
  layer?: "back" | "front";
  /** width in % of the scene, for props that span architecture (curtains, lights, benches) */
  span?: number;
  /** hanging props: drop from the ceiling in % of the scene height */
  drop?: number;
}

export type WallStyle = "plaster" | "stone" | "brick" | "logs" | "planks" | "wallpaper" | "clay";
export type FloorStyle = "boards" | "planks" | "tatami" | "tiles" | "stone";

export interface WorldSurfaces {
  wall: WallStyle;
  floor: FloorStyle;
  /** wooden lower-wall panelling */
  wainscot?: boolean;
  /** exposed ceiling beams */
  beams?: boolean;
  /** vertical posts, x in % (Japanese/pavilion framing) */
  posts?: number[];
  postColor?: string;
}

export type SeatStyle = "wood" | "armchair" | "bentwood" | "office" | "cushion" | "blanketChair";
export type TableStyle = "desk" | "cafeTable" | "lowTable" | "readingTable" | "cabinDesk";
export type DeskItem =
  | "book"
  | "coffee"
  | "cake"
  | "tea"
  | "cocoa"
  | "mug"
  | "stationery"
  | "succulent"
  | "inkwell"
  | "bookPile"
  | "starMap";
export type OutfitId =
  | "kimono"
  | "cloak"
  | "cardigan"
  | "hoodie"
  | "winter"
  | "coat"
  | "flannel"
  | "light";

export interface AvatarSetup {
  x: number;
  y: number;
  scale: number;
  facing: 1 | -1;
  seat: SeatStyle;
  table: TableStyle;
  items: DeskItem[];
  outfit: OutfitId;
}

export type ParticleKind = "dust" | "magic" | "embers" | "petals" | "glints";

export interface ParticleField {
  kind: ParticleKind;
  count: number;
  /** % of the scene */
  region: { x: number; y: number; w: number; h: number };
}

export interface FeaturePosition {
  x: number;
  y: number;
  /** raise the object by this many scene units, to stand on a prop surface */
  lift?: number;
}

export interface WorldConfig {
  id: string;
  name: string;
  tagline: string;
  unlockHours: number;
  outdoor: OutdoorKind;
  supportedWeather: WeatherKind[];
  roomFeatures: RoomFeature[];
  windows: WindowRegion[];
  props: RoomProp[];
  ambience: string[];
  avatar: AvatarSetup;
  /** oklch strings — the world's own material palette */
  palette: {
    accent: string;
    wallTop: string;
    wallBottom: string;
    floor: string;
    trim: string;
    glow: string;
  };
  surfaces: WorldSurfaces;
  particles?: ParticleField[];
  /** how the room's own light objects look */
  featureStyles?: {
    fireplace?: "stone" | "cabin" | "stove";
    candles?: "pillars" | "floating" | "lantern" | "votive" | "flame";
  };
  /** frosted glass and snow on the sills */
  frost?: boolean;
  /** what happens when the Window feature is switched off, per world */
  windowOff: "shutters" | "curtains" | "shoji" | "blinds" | "dome";
  featurePositions?: Partial<Record<RoomFeature, FeaturePosition>>;
}
