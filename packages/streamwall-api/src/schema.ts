import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  enum UserRole {
    VIEWER
    EDITOR
    ADMIN
  }

  enum StreamPlatform {
    YOUTUBE
    TWITCH
    FACEBOOK
    INSTAGRAM
    GENERIC
    HLS
    RTMP
  }

  enum DataSourceType {
    JSON_API
    TOML_FILE
    MANUAL
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
    sessions: [Session!]!
    createdSessions: [Session!]!
  }

  type Stream {
    id: ID!
    url: String!
    title: String!
    platform: StreamPlatform!
    thumbnail: String
    metadata: JSON
    isLive: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    views: [View!]!
  }

  type Session {
    id: ID!
    name: String!
    description: String
    gridCols: Int!
    gridRows: Int!
    isPublic: Boolean!
    createdBy: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    creator: User!
    users: [User!]!
    views: [View!]!
  }

  type View {
    id: ID!
    sessionId: String!
    streamId: String
    positionX: Int!
    positionY: Int!
    width: Int!
    height: Int!
    audioEnabled: Boolean!
    blurred: Boolean!
    visible: Boolean!
    session: Session!
    stream: Stream
  }

  type DataSource {
    id: ID!
    name: String!
    type: DataSourceType!
    url: String
    filePath: String
    refreshInterval: Int!
    enabled: Boolean!
    lastSync: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Query {
    # Users
    me: User
    users: [User!]!
    user(id: ID!): User

    # Streams
    streams(limit: Int, offset: Int, search: String): [Stream!]!
    stream(id: ID!): Stream
    streamByUrl(url: String!): Stream

    # Sessions
    sessions(limit: Int, offset: Int, isPublic: Boolean): [Session!]!
    session(id: ID!): Session
    mySessions: [Session!]!

    # Data Sources
    dataSources: [DataSource!]!
    dataSource(id: ID!): DataSource
  }

  type Mutation {
    # Authentication
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!

    # Streams
    createStream(url: String!, title: String!, platform: StreamPlatform): Stream!
    updateStream(id: ID!, title: String, platform: StreamPlatform, metadata: JSON): Stream!
    deleteStream(id: ID!): Boolean!

    # Sessions
    createSession(name: String!, description: String, gridCols: Int, gridRows: Int, isPublic: Boolean): Session!
    updateSession(id: ID!, name: String, description: String, gridCols: Int, gridRows: Int, isPublic: Boolean): Session!
    deleteSession(id: ID!): Boolean!

    # Views
    createView(sessionId: ID!, streamId: ID, positionX: Int!, positionY: Int!, width: Int, height: Int): View!
    updateView(id: ID!, streamId: ID, positionX: Int, positionY: Int, width: Int, height: Int, audioEnabled: Boolean, blurred: Boolean, visible: Boolean): View!
    deleteView(id: ID!): Boolean!

    # Data Sources
    createDataSource(name: String!, type: DataSourceType!, url: String, filePath: String, refreshInterval: Int): DataSource!
    updateDataSource(id: ID!, name: String, url: String, filePath: String, refreshInterval: Int, enabled: Boolean): DataSource!
    deleteDataSource(id: ID!): Boolean!
    syncDataSource(id: ID!): DataSource!
  }

  type Subscription {
    # Real-time updates
    streamAdded: Stream!
    streamUpdated: Stream!
    streamRemoved: ID!
    
    sessionUpdated(sessionId: ID!): Session!
    viewUpdated(sessionId: ID!): View!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
