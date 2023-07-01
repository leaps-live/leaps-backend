-- Users Table 
CREATE TABLE tbl_user (
    userId UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    -- user_typeid UUID REFERENCES tblUser_Type(user_typeid) NOT NULL ON DELETE CASCADE,
    userFormalName VARCHAR(55) NOT NULL,
    username VARCHAR(105) NOT NULL,
    userEmail VARCHAR(25) NOT NULL,
    userPassword VARCHAR(25) NOT NULL,
    userBirthday DATE NOT NULL,
    userHeight DECIMAL,
    userWeight DECIMAL,
    userCoins INT NOT NULL DEFAULT 0
);

-- Example Data Insert for tbl_user
INSERT INTO tbl_user (userFormalName, username, userEmail, userPassword, userBirthday, userHeight, userWeight) VALUES ('Julius Cecilia', 'juliuscecilia33', 'juliuscecilia33@gmail.com', 'asdfasdf', '05/30/2002','5','135');


----------------------------


CREATE TABLE tblUser_Type (
    user_typeid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    user_type VARCHAR(55) NOT NULL,
)

CREATE TABLE tbl_league (
    league_id UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    leagueName VARCHAR(105) NOT NULL,
    leagueDescription VARCHAR NOT NULL,
    leagueAdmin TEXT[] --store userid
)

CREATE TABLE tbl_category (
    categoryid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    categories TEXT[] NOT NULL
    leagueid UUID REFERENCES tblLeague(leagueid) NOT NULL ON DELETE CASCADE
)

CREATE TABLE tbl_team (
    teamid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    categoryid UUID REFERENCES tblCategory(categoryid) NOT NULL ON DELETE CASCADE,
    teamName VARCHAR(25) NOT NULL,
    createDate DATE NOT NULL,
    teamDescription VARCHAR NOT NULL,
    creator UUID REFERENCES tblUser(userid) NOT NULL ON DELETE CASCADE
)

CREATE TABLE tbl_team_user (
    team_userid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    teamid UUID REFERENCES tblTeam(teamid) NOT NULL ON DELETE CASCADE,
    userid UUID REFERENCES tblUser(userid) NOT NULL ON DELETE CASCADE,
    isCaptain BOOLEAN NOT NULL DEFAULT FALSE
)

CREATE TABLE tbl_game (
  gameid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
  gameName VARCHAR(30) NOT NULL,
  --teamA UUID REFERENCES tblTeam(teamid) NOT NULL ON DELETE CASCADE,
  --teamB UUID REFERENCES tblTeam(teamid) NOT NULL ON DELETE CASCADE,
  leagueid UUID REFERENCES tblLeague(leagueid) NOT NULL ON DELETE CASCADE,
  startTime DATETIME,
  endTime DATETIME,
  --teamA_score INT NOT NULL DEFAULT 0,
  --teamB_score INT NOT NULL DEFAULT 0,
  isStart BOOLEAN NOT NULL DEFAULT FALSE,
  isEnd BOOLEAN NOT NULL DEFAULT FALSE,
  recordingurl TEXT[]
)

--CREATE TABLE tbl_game_league (
--    game_leagueid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
--    gameid UUID REFERENCES tblGame(gameid) NOT NULL ON DELETE CASCADE,
--    leagueid UUID REFERENCES tblLeague(leagueid) NOT NULL ON DELETE CASCADE
--)

CREATE TABLE tbl_game_team (
    game_teamid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    teamid UUID REFERENCES tblTeam(teamid) NOT NULL ON DELETE CASCADE,
    gameid UUID REFERENCES tblGame(gameid) NOT NULL ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    assists INT NOT NULL DEFAULT 0,
    blocks INT NOT NULL DEFAULT 0,
    rebounds INT NOT NULL DEFAULT 0,
    steals INT NOT NULL DEFAULT 0,
    turnovers INT NOT NULL DEFAULT 0,
    fouls INT NOT NULL DEFAULT 0,
)

CREATE TABLE tbl_game_user (
    game_userid UUID DEFAULT uuid_generate_v4() UNIQUE PRIMARY KEY,
    userid UUID REFERENCES tblUser(userid) NOT NULL ON DELETE CASCADE,
    gameid UUID REFERENCES tblGame(gameid) NOT NULL ON DELETE CASCADE,
    score INT NOT NULL DEFAULT 0,
    assists INT NOT NULL DEFAULT 0,
    blocks INT NOT NULL DEFAULT 0,
    rebounds INT NOT NULL DEFAULT 0,
    steals INT NOT NULL DEFAULT 0,
    turnovers INT NOT NULL DEFAULT 0,
    fouls INT NOT NULL DEFAULT 0,
    fieldGoalMade INT NOT NULL DEFAULT 0,
    fieldGoalAttempted INT NOT NULL DEFAULT 0,
    3ptMade INT NOT NULL DEFAULT 0,
    3ptAttempted INT NOT NULL DEFAULT 0,
    FTMade INT NOT NULL DEFAULT 0,
    FTAttempted INT NOT NULL DEFAULT 0
)