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
    tournament_id INT REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    order_number INT NOT NULL DEFAULT 0
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

-- 2. Group Table
-- The tournament is divided into several stages. The first stage is the group stage,
-- which can be divided into multiple zones, such as the upper and lower zones. Each
-- zone is divided into multiple groups, which can be named A, B, C, etc. After the
-- group stage, it proceeds to the top 8, which can be named "Top 8," followed by the
-- top 4, semifinals, and finals
CREATE TABLE match_group (
    match_group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL,
    tournament_id INT REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    parent_match_group_id INT REFERENCES match_group(match_group_id) ON DELETE SET NULL,

    -- The order number of the group in the parent group
    -- like: Z1, A, B, C, Top 8, Top 4, Semifinals, Finals
    order_number INT NOT NULL
);

-- Associate teams with match_groups
CREATE TABLE match_group_team (
    match_group_team_id SERIAL PRIMARY KEY,
    match_group_id INT REFERENCES match_group(match_group_id) ON DELETE CASCADE,
    team_id INT REFERENCES team(team_id) ON DELETE CASCADE
);

-- 4. Team_Match Table
--- team match is a match between two or multiple teams
CREATE TABLE team_match (
    team_match_id SERIAL PRIMARY KEY,
    tournament_id INT REFERENCES tournament(tournament_id) ON DELETE CASCADE,
    group_id INT REFERENCES match_group(group_id) ON DELETE SET NULL,
    time TIMESTAMP
);


-- 5. Match Table
-- a match is between players, like men double, women double, mix double
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

-- 8. the teams in a specific team match
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