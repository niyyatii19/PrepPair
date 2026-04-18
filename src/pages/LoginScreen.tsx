import { useState, useEffect } from "react";
import { getUsersInRoom } from "../lib/firebaseRoom";

interface LoginScreenProps {
  onLogin: (user: any) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [role, setRole] = useState("you");
  const [availableRoles, setAvailableRoles] = useState(["you", "friend"]);

  // Check room for existing users and disable taken roles
  useEffect(() => {
    if (!room.trim()) {
      setAvailableRoles(["you", "friend"]);
      return;
    }

    const roomCode = room.toUpperCase().trim();

    // Listen to users in the room
    const unsubscribe = getUsersInRoom(roomCode, (users) => {
      const taken = Object.values(users).map((u: any) => u?.role);
      const available = ["you", "friend"].filter((r) => !taken.includes(r));

      setAvailableRoles(available.length > 0 ? available : ["you", "friend"]);

      // If 'you' is taken, auto-set to 'friend'
      if (!available.includes("you") && role === "you") {
        setRole("friend");
      }
    });

    return () => unsubscribe();
  }, [room, role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !room.trim()) {
      alert("Please enter your name and room code");
      return;
    }

    const roomCode = room.toUpperCase().trim();
    // Use role + room to create deterministic userId (persists across logins)
    const userId = `${role}-${roomCode}`;

    const user = {
      name: name.trim(),
      room: roomCode,
      role: role,
      id: userId,
      createdAt: new Date().toISOString(),
    };

    onLogin(user);
  };

  return (
    <div className="screen-login">
      <div className="login-wrap">
        <div className="logo-mark">PP</div>
        <div>
          <h1 className="login-title">
            Prep<span>Pair</span>
          </h1>
          <p className="login-sub">
            Track goals. Stay accountable. Crush it together.
          </p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arjun"
              maxLength={20}
            />
          </div>
          <div className="input-group">
            <label>
              Room code{" "}
              <span style={{ color: "var(--muted2)", fontSize: "0.72em" }}>
                (share with friend)
              </span>
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value.toUpperCase())}
              placeholder="e.g. PREP2025"
              maxLength={12}
              style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
            />
          </div>
          <div className="input-group">
            <label>Your role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={availableRoles.length === 1}
            >
              {availableRoles.includes("you") && (
                <option value="you">Player 1 (You)</option>
              )}
              {availableRoles.includes("friend") && (
                <option value="friend">Player 2 (Friend)</option>
              )}
            </select>
            {availableRoles.length === 1 && (
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--accent)",
                  marginTop: "4px",
                }}
              >
                ℹ️ You've been assigned as{" "}
                {availableRoles[0] === "you"
                  ? "Player 1 (You)"
                  : "Player 2 (Friend)"}
              </div>
            )}
          </div>
          <div className="room-info">
            💡 Both you and your friend open this app, enter the{" "}
            <strong>same room code</strong>, and choose different roles. That's
            it — you're paired!
          </div>
          <button type="submit" className="btn-primary">
            Enter Room →
          </button>
        </form>
      </div>
    </div>
  );
}
