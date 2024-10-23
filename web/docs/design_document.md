# Badminton Tournament Management System Design Document

## 1. System Overview

The Badminton Tournament Management System is a web-based application designed to manage badminton tournaments, teams, players, and matches. It provides functionality for tournament organizers, team managers, and players to view and manage tournament-related information within a hierarchical structure.

## 2. Architecture

The system follows a client-server architecture:

- Frontend: Angular-based single-page application (SPA)
- Backend: RESTful API (implementation details not covered in this document)
- Database: (Backend implementation detail, not covered)

## 3. Component Structure

The Angular application is structured into the following main components:

- AppComponent: Root component
- DashboardComponent: Displays overview and quick actions
- TournamentListComponent: Displays list of all tournaments
- SingleTournamentComponent: Shows details of a specific tournament and manages sub-components
  - TournamentTeamsComponent: Manages teams within the tournament
  - TournamentPlayersComponent: Manages players within the tournament
  - TournamentMatchesComponent: Manages matches within the tournament
  - TournamentStandingsComponent: Shows tournament standings
  - TournamentGroupsComponent: Manages groups within the tournament
- TeamDetailsComponent: Displays team details and players
- PlayerDetailsComponent: Shows player details and match history
- MatchDetailsComponent: Displays details of a specific match
- LoginComponent: Handles user authentication
- AdminPanelComponent: Provides administrative functions

## 4. Key Features

### 4.1 Tournament Management
- List all tournaments
- View single tournament details
- Manage teams, players, and matches within a tournament context
- Display match result matrix
- Show team standings
- Manage tournament groups

### 4.2 Team Management (Within Tournament)
- List teams within a tournament
- View team details
- Add/remove players from teams (admin only)

### 4.3 Player Management (Within Tournament)
- List players within a tournament
- View and edit player details
- View player match history

### 4.4 Match Management (Within Tournament)
- Create team matches (admin only)
- Create single matches within team matches (admin only)
- Delete matches (admin only)
- Display match results

### 4.5 Group Management
- Create and manage groups and subgroups within a tournament
- Associate teams with groups
- Display group-specific standings and match results

### 4.6 Dashboard
- Display ongoing tournaments
- Provide quick actions for admins

### 4.7 Admin Panel
- Manage users and roles
- Configure system settings
- Perform data management tasks

### 4.8 Authentication and Authorization
- User login
- Admin privileges for certain actions

## 5. Data Models

### 5.1 Tournament
- id: number
- name: string
- startDate: string
- endDate: string

### 5.2 Team
- id: number
- name: string
- players: Player[]

### 5.3 Player
- id: number
- name: string
- gender: string

### 5.4 TeamMatch
- id: number
- tournamentId: number
- matchNumber: number
- teams: Team[]
- singleMatches: SingleMatch[]

### 5.5 SingleMatch
- id: number
- teamMatchId: number
- matchType: string
- teams: [
    {
      id: number,
      players: Player[],
      scores: number[]
    },
    {
      id: number,
      players: Player[],
      scores: number[]
    }
  ]

### 5.6 TeamStanding
- teamName: string
- teamWins: number
- teamLosses: number
- teamTies: number
- matchWins: number

### 5.7 MatchGroup
- id: number
- tournamentId: number
- groupName: string
- teams: Team[]

## 6. User Interface Design

### 6.1 Layout
- Consistent header with navigation menu
- Main content area for displaying component-specific information
- Sub-navigation menu for tournament sections (Teams, Players, Matches, Standings, Groups)
- Responsive design for mobile and desktop viewing

### 6.2 Key UI Elements
- Dashboard with quick actions and overview
- Tournament list with clickable items
- Single tournament view with sub-section navigation
- Match result matrix with clickable cells
- Team standings table
- Forms for creating and editing various entities
- Login form

## 7. API Integration

The frontend communicates with the backend API for all data operations. Key API endpoints include:

- GET /api/tournament: Fetch all tournaments
- GET /api/tournament/{id}: Fetch single tournament details
- GET /api/tournament/{id}/team: Fetch teams for a tournament
- GET /api/tournament/{id}/standing: Fetch tournament standings
- GET /api/team/{id}: Fetch team details
- GET /api/team/{id}/player: Fetch players for a team
- POST /api/player: Add a new player
- DELETE /api/player/{id}: Delete a player
- POST /api/team_match: Create a new team match
- GET /api/team_match/{id}: Fetch team match details
- POST /api/match: Create a new single match
- DELETE /api/match/{id}: Delete a single match
- GET /api/player/{id}/matches: Fetch player match history
- POST /api/group: Create a new group
- GET /api/group/{id}: Fetch group details
- GET /api/group/{id}/teams: Fetch teams within a group

## 8. Security Considerations

- Use JWT for authentication
- Implement role-based access control (RBAC) for admin actions
- Secure API endpoints to prevent unauthorized access

## 9. Future Enhancements

- Implement real-time updates for match scores
- Add tournament creation and management features
- Integrate with external badminton ranking systems
- Implement a mobile app version
- Enhance the Admin Panel with more advanced features

## 10. Conclusion

This design document outlines the updated structure and key features of the Badminton Tournament Management System, including the new hierarchical organization of tournaments, teams, players, and matches, as well as the addition of group management and an admin panel. It serves as a guide for development and can be expanded upon as the project evolves.
