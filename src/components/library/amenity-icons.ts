import { GlassWater, Lock, PlugZap, Snowflake, Users, VolumeX, Wifi, type LucideIcon } from "lucide-react";
import type { Amenity } from "@/lib/types";

export const AMENITY_ICONS: Record<Amenity, LucideIcon> = {
  ac: Snowflake,
  wifi: Wifi,
  silent: VolumeX,
  lockers: Lock,
  charging: PlugZap,
  water: GlassWater,
  "group-friendly": Users,
};