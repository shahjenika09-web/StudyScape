import type { TableStyle } from "@/data/types";

/**
 * The study spot (seat → character → table) is drawn as three stacked SVGs in
 * one shared coordinate frame, so the character always sits at its own table
 * whatever the screen size. Floor is y = 176; the table is to the right.
 */
export const RIG_WIDTH = 25;

/** y of each table's top surface in rig coordinates */
export const TABLE_TOP: Record<TableStyle, number> = {
  desk: 124,
  cafeTable: 124,
  readingTable: 122,
  cabinDesk: 122,
  lowTable: 144,
};

/** floor-sitting worlds lower the whole body by this much */
export const FLOOR_DROP = 26;
