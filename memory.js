const sessions = new Map();

export function getMemory(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  return sessions.get(sessionId);
}

export function saveMessage(sessionId, role, content) {
  const memory = getMemory(sessionId);
  memory.push({ role, content });

  if (memory.length > 10) memory.shift(); // limit memory
}
