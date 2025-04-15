# Macrotrue Software Development Plan

## Overview

This document outlines the development plan for Macrotrue, a SaaS application that helps users calculate their caloric needs and provides meal recommendations based on their goals.

## Progress Checklist

### Completed Features ✅

1. **Project Setup**

   - [x] Next.js with TypeScript setup
   - [x] Tailwind CSS and Shadcn UI configuration
   - [x] Project structure and conventions
   - [x] Git repository initialization

2. **Authentication & Landing Page**

   - [x] Clerk authentication implementation
   - [x] Login/signup flows
   - [x] Protected routes with server-side middleware
   - [x] Client-side authentication guards
   - [x] Responsive landing page
   - [x] Basic navigation

3. **Core Features**
   - [x] Implement reset button logic
   - [x] Add meal refresh functionality
   - [ ] Create meal rotation system
   - [ ] Implement refresh limits
   - [x] Add upgrade prompts

### In Progress Features 🚧

1. **Database Migration**

   - [ ] Set up Supabase project
   - [ ] Design database schema
   - [ ] Migrate existing data
   - [ ] Update API endpoints
   - [ ] Implement real-time features

2. **Payment Integration**

   - [ ] Set up Stripe account
   - [ ] Configure subscription tiers
   - [ ] Implement payment flow
   - [ ] Handle webhooks
   - [ ] Test payment system

3. **Workout App Integration**

   - [ ] Identify core components for migration
   - [ ] Analyze dependencies and conflicts
   - [ ] Create module structure
   - [ ] Migrate and adapt components
   - [ ] Integrate with existing auth system

### Upcoming Features 📋

1. **Enhanced Meal System**

   - [ ] Expand meal database
   - [ ] Add meal preferences
   - [ ] Implement portion customization
   - [ ] Add nutritional goals

2. **Testing & Optimization**
   - [ ] Performance testing
   - [ ] User acceptance testing
   - [ ] Security testing
   - [ ] Load testing

## Immediate Priority Tasks

### 1. Supabase Integration

1. **Initial Setup**

   - Create Supabase project
   - Configure authentication
   - Set up database tables
   - Define access policies

2. **Data Migration**

   - Design user table schema
   - Create meals table
   - Set up subscription table
   - Migrate existing data
   - Update API endpoints

### 2. Stripe Implementation

1. **Payment Infrastructure**

   - Set up Stripe account
   - Configure webhook endpoints
   - Create subscription products
   - Set up test environment

2. **User Interface**

   - Design pricing page
   - Create checkout flow
   - Implement subscription management
   - Add payment status indicators

### 3. Workout App Integration

1. **Analysis and Planning**

   - Identify the 3-4 key components to migrate
   - Document component dependencies
   - Create integration architecture diagram
   - Identify shared data requirements
   - Map authentication flows

2. **Component Migration**

   - Create workout module directory structure
   - Copy and adapt core components
   - Update import paths and references
   - Refactor any incompatible code
   - Adapt styles to match existing design system

3. **Integration**

   - Create navigation links to workout section
   - Implement state sharing mechanism
   - Connect to authentication context
   - Add data persistence where needed
   - Ensure responsive design

4. **Testing**

   - Test components in isolation
   - Verify integrated functionality
   - Test on different devices
   - Create automated tests
   - Fix any styling inconsistencies

## Tech Stack

- React
- Next.js
- TypeScript
- Authentication: Clerk
- UI: Shadcn UI
- Database: Supabase
- Payments: Stripe
- Icons: lucide-react

## Development Phases

### Phase 1: Project Setup and Authentication (1-2 weeks) ✅

1. **Project Initialization**

   - [x] Set up Next.js with TypeScript
   - [x] Configure Tailwind CSS and Shadcn UI
   - [x] Set up project structure and conventions
   - [x] Initialize Git repository

2. **Authentication System**

   - [x] Implement Clerk authentication
   - [x] Create login/signup flows
   - [x] Set up protected routes with middleware
   - [x] Implement client-side auth guards
   - [x] Design user profile schema

3. **Landing Page**
   - [x] Design and implement responsive landing page
   - [x] Add authentication flows
   - [x] Create marketing content sections
   - [x] Implement navigation

### Phase 2: Core Calorie Calculator (2-3 weeks)

1. **User Input Form**

   - Create form for user details (weight, height, age)
   - Add activity level selection
   - Implement goal selection (weight loss/gain/maintenance)
   - Add form validation

2. **Calculation Logic**

   - Implement BMR (Basal Metabolic Rate) calculation
   - Add activity multiplier logic
   - Create goal-based adjustments
   - Implement error handling

3. **Data Management**
   - Set up user profile storage
   - Create progress tracking
   - Implement data persistence
   - Add user settings management

### Phase 3: Meal Recommendation System (3-4 weeks)

1. **Meal Database**

   - Create comprehensive JSON meal database
   - Include nutritional information
   - Add meal categories and tags
   - Include portion sizes

2. **Recommendation Engine**

   - Implement meal selection algorithm
   - Create daily meal combination logic
   - Add nutritional balance checking
   - Implement meal rotation system

3. **User Interface**
   - Design meal display components
   - Create meal details view
   - Implement meal refresh functionality
   - Add meal preference settings

### Phase 4: Subscription System (2-3 weeks)

1. **Tier Structure**

   - Implement free tier limitations
   - Create premium tier features
   - Set up subscription management
   - Design upgrade flows

2. **Payment Integration**

   - Set up Stripe integration
   - Implement payment processing
   - Create subscription webhooks
   - Add payment error handling

3. **Feature Gating**
   - Implement meal refresh limits
   - Add premium features
   - Create upgrade prompts
   - Set up usage tracking

### Phase 5: Testing and Deployment (2-3 weeks)

1. **Testing**

   - Write unit tests for core functions
   - Implement integration tests
   - Add end-to-end testing
   - Perform security testing

2. **Optimization**

   - Optimize performance
   - Implement caching
   - Add loading states
   - Optimize database queries

3. **Deployment**
   - Set up production environment
   - Configure CI/CD pipeline
   - Implement monitoring
   - Add analytics tracking

### Phase 6: Workout App Integration (1-2 weeks)

1. **Component Migration**

   - Identify core workout components
   - Create modular architecture
   - Implement adapter patterns for state management
   - Ensure styling consistency

2. **Feature Integration**

   - Connect workout data with user profiles
   - Implement workout tracking
   - Add progress visualization
   - Create workout recommendation system

3. **Cross-Module Functionality**

   - Connect nutrition and workout data
   - Create holistic fitness dashboard
   - Implement shared progress tracking
   - Add combined reporting features

## Additional Considerations

### Security

- Implement data encryption
- Add rate limiting
- Set up security headers
- Regular security audits

### Monitoring

- Set up error tracking
- Implement usage analytics
- Add performance monitoring
- Create admin dashboard

### Documentation

- Create API documentation
- Write user guides
- Document codebase
- Create maintenance guides

## Timeline

- **Total Development Time**: 10-15 weeks
- **Testing and Refinement Buffer**: 2-3 weeks
- **Total Project Timeline**: 12-18 weeks

## Timeline Update

- **Database Migration**: 1-2 weeks
- **Payment Integration**: 1-2 weeks
- **Workout App Integration**: 1-2 weeks
- **Testing & Refinement**: 1 week

## Success Metrics

1. User engagement with meal recommendations
2. Subscription conversion rates
3. User retention rates
4. System performance metrics
5. Customer satisfaction scores

## Risk Management

### Current Risks

1. **Technical Risks**

   - Meal randomization efficiency
   - Reset button performance
   - Data structure scalability

2. **Mitigation Strategies**
   - Implement efficient algorithms
   - Use caching mechanisms
   - Regular performance testing

## Future Considerations

1. Mobile app development
2. AI-powered meal recommendations
3. Social features and sharing
4. Integration with fitness trackers
5. Expanded meal database

## Review and Updates

This plan should be reviewed weekly to track progress and adjust priorities as needed.

### Weekly Review Checklist

- [x] Review completed features
  - [x] Protected routes implementation
  - [x] Authentication flow
- [ ] Test payment integration
- [ ] Monitor database performance
- [ ] Address security concerns
- [ ] Plan next week's priorities

### Next Steps

1. Set up Supabase project and configure initial settings
2. Create database schema and migration plan
3. Set up Stripe account and test environment
4. Begin workout app component analysis
5. Implement basic payment flow
6. Add subscription management features

## Best Practices for Workout App Integration

### Modular Architecture

- Create a self-contained workout module
- Minimize dependencies on parent application
- Use clear interfaces for data exchange
- Maintain separation of concerns

### State Management

- Use context providers for shared state
- Implement adapter pattern for different state approaches
- Keep workout state isolated when possible
- Define clear data flow patterns

### Styling Approach

- Adapt component styling to match Macrotrue design system
- Use CSS modules or styled components for encapsulation
- Maintain consistent user experience
- Ensure responsive design across devices

### Code Reusability

- Extract reusable utilities and hooks
- Create shared component library
- Document component APIs clearly
- Implement consistent prop interfaces

### Testing Strategy

- Test components in isolation
- Create integration tests for workflows
- Test with different user roles
- Verify mobile responsiveness
