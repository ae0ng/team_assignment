export function parseGroupsFromText(text) {
  const lines = text.trim().split("\n");

  let aGroup = [],
    bGroup = [],
    cGroup = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "A그룹") {
      aGroup = lines[i + 1].trim().split(" ");
    } else if (line === "B그룹") {
      bGroup = lines[i + 1].trim().split(" ");
    } else if (line === "C그룹") {
      cGroup = lines[i + 1].trim().split(" ");
    }
  }

  return { aGroup, bGroup, cGroup };
}

export function getShuffledTeams(aGroup, bGroup, cGroup) {
  const a = [...aGroup];
  const b = [...bGroup];
  const c = [...cGroup];
  const teams = [];

  // 기본 조 짜기
  while (a.length && b.length && c.length) {
    const groups = { a, b, c };
    const maxGroup = Object.keys(groups).reduce((a, b) =>
      groups[a].length > groups[b].length ? a : b
    );

    const pickA = a.pop();
    const pickB = b.pop();
    const pickC = c.pop();
    const pickD = groups[maxGroup].pop();

    teams.push([pickA, pickB, pickC, pickD]);
  }

  // 남은 인원
  const remaining = [...a, ...b, ...c];
  const remainder = remaining.length;

  if (remainder === 1) {
    teams[teams.length - 1].push(remaining[0]);
  } else if (remainder === 2) {
    teams[teams.length - 1].push(remaining[0]);
    teams[teams.length - 2].push(remaining[1]);
  } else if (remainder === 3) {
    teams.push([remaining[0], remaining[1], remaining[2]]);
  }

  return teams;
}
