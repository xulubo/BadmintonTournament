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
    player_name VARCHAR(255) NOT NULL,
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
    match_id INT REFERENCES match(match_id) ON DELETE CASCADE,
    team_id INT REFERENCES team(team_id) ON DELETE CASCADE,
    team_score INT NOT NULL,
    PRIMARY KEY (match_id, team_id)
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
    team_id INT REFERENCES team(team_id) ON DELETE CASCADE
);