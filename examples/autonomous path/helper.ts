export function scalerProjection(path, pos) {
  let line = path.end.get().abc(path.start);
  let link = pos.get().abc(path.start);
  let angle = Math.acos(
    (line.x * link.x + line.y * link.y) / (link.mag() * line.mag())
  );
  let sp = line.get().normalise();
  sp.mult(Math.cos(angle) * link.mag()).add(path.start);
  return sp;
}
