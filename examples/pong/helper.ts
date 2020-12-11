export function detect(elm1, elm2) {
  const ration = 0.5;

  if (
    elm1.pos.x - elm1.size.x * ration <= elm2.pos.x + elm2.size.x * ration &&
    elm1.pos.x + elm1.size.x * ration >= elm2.pos.x - elm2.size.x * ration &&
    elm1.pos.y - elm1.size.y * ration <= elm2.pos.y + elm2.size.y * ration &&
    elm1.pos.y + elm1.size.y * ration >= elm2.pos.y - elm2.size.y * ration
  ) {
    return true;
  }
}
