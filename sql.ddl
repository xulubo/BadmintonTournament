-- 1. Tournament Table
CREATE TABLE tournament (
    tournament_id SERIAL PRIMARY KEY,
    tournament_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_time TIMESTAMP,
    organizer VARCHAR(255),
    prize VARCHAR(255)
);

-- 2. Team Table
CREATE TABLE team (
    team_id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    tournament_id INT REFERENCES tournament(tournament_id) ON DELETE CASCADE
);

-- 3. Player Table
CREATE TABLE player (
    player_id SERIAL PRIMARY KEY,
    player_name VARCHAR(255) NOT NULL, -- nick name
    first_name VARCHAR(255) NOT NULL,

    last_name VARCHAR(255) NOT NULL,

    comment VARCHAR(1024) NOT NULL,

    team_id INT REFERENCES team(team_id) ON DELETE SET NULL
);

-- 4. Team_Match Table
CREATE TABLE team_match (
    team_match_id SERIAL PRIMARY KEY,
    tournament_id INT REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    time TIMESTAMP
);


-- 5. Match Table
CREATE TABLE match (
    match_id SERIAL PRIMARY KEY,
    team_match_id INT REFERENCES team_match(team_match_id) ON DELETE CASCADE,
    match_number INT NOT NULL,
    type character
);

-- 6. Game_Score Table
CREATE TABLE game_score (
    game_score_id SERIAL PRIMARY KEY,
    game_number INT,
    match_id INT REFERENCES match(match_id) ON DELETE CASCADE,
    team_id INT REFERENCES team(team_id) ON DELETE CASCADE,
    team_score INT NOT NULL
);

-- 7. Match_Players Table
CREATE TABLE match_players (
    match_id INT REFERENCES match(match_id) ON DELETE CASCADE,
    team_id INT REFERENCES team(team_id) ON DELETE CASCADE,
    player_id INT REFERENCES player(player_id) ON DELETE CASCADE,
    PRIMARY KEY (match_id, team_id, player_id)
);

-- 8.
CREATE TABLE team_match_team (
    team_match_team_id SERIAL PRIMARY KEY,
    team_match_id INT REFERENCES team_match(team_match_id) ON DELETE CASCADE,
    team_id INT REFERENCES team(team_id) ON DELETE CASCADE,
    total_wins INT
);



CREATE OR REPLACE VIEW team_match_view AS
SELECT
    tm.team_match_id,
    t.team_id,
    t.team_name,
    m.match_number,
    s.game_number,
    m.type,
    s.team_score,
    p.player_id,
    p.player_name,
    p.gender
FROM
    team_match tm
LEFT JOIN team_match_team tmt ON tm.team_match_id = tmt.team_match_id
LEFT JOIN match m ON tm.team_match_id = m.team_match_id
LEFT JOIN team t ON tmt.team_id = t.team_id
LEFT JOIN match_players mp ON mp.match_id = m.match_id AND mp.team_id = tmt.team_id
LEFT JOIN player p ON p.player_id = mp.player_id
LEFT JOIN game_score s ON m.match_id = s.match_id AND s.team_id = tmt.team_id
ORDER BY
    m.match_number,
    s.game_number,
    tmt.team_id;