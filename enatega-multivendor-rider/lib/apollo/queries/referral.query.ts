import { gql } from "@apollo/client";

// Requirement 1: Recent Activity + See More
export const FETCH_RIDER_RECENT_ACTIVITY = gql`
  query FetchRiderRecentActivity(
    $startDate: String
    $endDate: String
    $limit: Int
    $offset: Int
  ) {
    fetchRiderRecentActivity(
      filter: {
        startDate: $startDate
        endDate: $endDate
        limit: $limit
        offset: $offset
      }
    ) {
      activities {
        _id
        user_name
        user_rank
        type
        source
        level
        value
        triggeredBy
        createdAt
      }
      summary {
        totalEarnings
        totalReferrals
        periodStart
        periodEnd
      }
      hasMore
      total
    }
  }
`;

// Requirement 2: Single Activity Details
export const FETCH_RIDER_ACTIVITY_DETAILS = gql`
  query FetchRiderActivityDetails($activityId: String!) {
    fetchRiderActivityDetails(activityId: $activityId) {
      _id
      totalEarnings
      totalReferrals
      createdAt
      referralsByLevel {
        level1 {
          count
          earnings
          riders {
            _id
            name
            phone
            joinedAt
            earnedAmount
          }
        }
        level2 {
          count
          earnings
          riders {
            _id
            name
            phone
            joinedAt
            earnedAmount
          }
        }
        level3 {
          count
          earnings
          riders {
            _id
            name
            phone
            joinedAt
            earnedAmount
          }
        }
      }
    }
  }
`;

// Requirement 2b: Multiple Activity Details (for date-based grouping)
export const FETCH_RIDER_ACTIVITIES_BY_DATE = gql`
  query FetchRiderActivitiesByDate(
    $startDate: String!
    $endDate: String!
  ) {
    fetchRiderRecentActivity(
      filter: {
        startDate: $startDate
        endDate: $endDate
        limit: 100
        offset: 0
      }
    ) {
      activities {
        _id
        user_name
        user_rank
        type
        source
        level
        value
        triggeredBy
        createdAt
      }
      summary {
        totalEarnings
        totalReferrals
        periodStart
        periodEnd
      }
      hasMore
      total
    }
  }
`;

// Requirement 3: Referral Rewards
export const FETCH_RIDER_REFERRAL_REWARDS = gql`
  query FetchRiderReferralRewards($level: Int) {
    fetchRiderReferralRewards(level: $level) {
      totalEarnings
      currentBalance
      totalWithdrawn
      earningsByLevel {
        level1 {
          totalEarnings
          totalReferrals
        }
        level2 {
          totalEarnings
          totalReferrals
        }
        level3 {
          totalEarnings
          totalReferrals
        }
      }
      referralDetails {
        riderId
        riderName
        riderPhone
        joinedAt
        level
        earnedAmount
        status
      }
    }
  }
`;
