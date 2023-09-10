-- Users Table 
CREATE TABLE tbl_user (
    userId UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    userFirstName VARCHAR(55) NOT NULL,
    userLastName VARCHAR(55) NOT NULL,
    username VARCHAR(105) NOT NULL UNIQUE,
    userEmail VARCHAR(40) NOT NULL UNIQUE,
    userPassword VARCHAR(25) NOT NULL,
    userBirthday DATE NOT NULL,
    userHeight DECIMAL,
    userWeight DECIMAL,
    userCoins INT NOT NULL DEFAULT 0
);

-- League Table
CREATE TABLE tbl_league (
    leagueId UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    leagueName VARCHAR(105) UNIQUE NOT NULL,
    leagueDescription VARCHAR,
    leagueCreator UUID REFERENCES tbl_user(userId) ON DELETE CASCADE NOT NULL,
    leagueAdmin TEXT[],
    leagueCategories TEXT[]
);

-- Team Table
CREATE TABLE tbl_team (
    teamId UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    teamCategories TEXT[],
    teamName VARCHAR(25) UNIQUE NOT NULL,
    teamCreateDate DATE NOT NULL,
    teamDescription VARCHAR NOT NULL,
    teamCreator UUID REFERENCES tbl_user(userId) ON DELETE CASCADE NOT NULL 
);

-- Bridge Table Between the Team and the team's Players
CREATE TABLE tbl_team_players (
    teamPlayersId UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    teamId UUID REFERENCES tbl_team(teamId) ON DELETE CASCADE NOT NULL,
    userId UUID REFERENCES tbl_user(userId) ON DELETE CASCADE NOT NULL,
    userRole BOOLEAN NOT NULL DEFAULT FALSE
);

-- Bridge Table Between the Team and League the team is apart of 
CREATE TABLE tbl_team_league (
    teamLeagueId UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    teamId UUID REFERENCES tbl_team(teamId) ON DELETE CASCADE NOT NULL,
    leagueId UUID REFERENCES tbl_league(leagueId) ON DELETE CASCADE NOT NULL,
    teamCategories TEXT[]
);

CREATE TABLE tbl_game (
  gameid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
  teamA UUID REFERENCES tbl_team(teamid) ON DELETE CASCADE NOT NULL,
  teamB UUID REFERENCES tbl_team(teamid) ON DELETE CASCADE NOT NULL,
  leagueid UUID REFERENCES tbl_league(leagueid) ON DELETE CASCADE NOT NULL,
  startTime TIMESTAMP,
  teamA_score INT NOT NULL DEFAULT 0,
  teamB_score INT NOT NULL DEFAULT 0,
  isStart BOOLEAN NOT NULL DEFAULT FALSE,
  isEnd BOOLEAN NOT NULL DEFAULT FALSE,
  recordingurl VARCHAR,
  numberOfQuarters INT NOT NULL DEFAULT 1,
  minutesPerQuarter INT NOT NULL DEFAULT 5,
  gameDescription VARCHAR,
  homeTeam VARCHAR,
  awayTeam VARCHAR,
  location VARCHAR
);

CREATE TABLE tbl_game_league (
   game_leagueid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
   gameid UUID REFERENCES tbl_game(gameid) ON DELETE CASCADE NOT NULL,
   leagueid UUID REFERENCES tbl_league(leagueid) ON DELETE CASCADE NOT NULL
);

CREATE TABLE tbl_game_team (
    game_teamid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    teamid UUID REFERENCES tbl_team(teamid) ON DELETE CASCADE NOT NULL,
    gameid UUID REFERENCES tbl_game(gameid) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL DEFAULT 0,
    assists INT NOT NULL DEFAULT 0,
    blocks INT NOT NULL DEFAULT 0,
    rebounds INT NOT NULL DEFAULT 0,
    steals INT NOT NULL DEFAULT 0,
    turnovers INT NOT NULL DEFAULT 0,
    fouls INT NOT NULL DEFAULT 0
);

CREATE TABLE tbl_game_user (
    game_userid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    userid UUID REFERENCES tbl_user(userid) ON DELETE CASCADE NOT NULL,
    gameid UUID REFERENCES tbl_game(gameid) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL DEFAULT 0,
    assists INT NOT NULL DEFAULT 0,
    blocks INT NOT NULL DEFAULT 0,
    rebounds INT NOT NULL DEFAULT 0,
    steals INT NOT NULL DEFAULT 0,
    turnovers INT NOT NULL DEFAULT 0,
    fouls INT NOT NULL DEFAULT 0,
    fieldGoalMade INT NOT NULL DEFAULT 0,
    fieldGoalAttempted INT NOT NULL DEFAULT 0,
    threePointMade INT NOT NULL DEFAULT 0,
    threePointAttempted INT NOT NULL DEFAULT 0,
    ftMade INT NOT NULL DEFAULT 0,
    ftAttempted INT NOT NULL DEFAULT 0
);

-- Example Data Insert for tbl_user
INSERT INTO tbl_user (userFirstName, userLastName, username, userEmail, userPassword, userBirthday, userHeight, userWeight) VALUES ('Julius', 'Cecilia', 'juliuscecilia33', 'juliuscecilia33@gmail.com', 'asdfasdf', '05/30/2002','5','135');


-- The tables below this line have not been added to our AWS Postgres DB yet...

--------------------------------------------------------------------------------------------------------------------------------------------


CREATE TABLE tbl_user_Type (
    user_typeid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    user_type VARCHAR(55) NOT NULL,
)

CREATE TABLE tbl_league_Type (
     league_typeid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
     league_type VARCHAR(55) NOT NULL,
)





