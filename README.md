# Decentralized Identity System

This project implements a decentralized identity system using Clarity smart contracts on the Stacks blockchain. It consists of three main components: a core identity contract, a user profile contract, and a reputation system.

## Table of Contents

1. [Overview](#overview)
2. [Components](#components)
3. [Setup](#setup)
4. [Testing](#testing)
5. [Usage](#usage)
6. [Contributing](#contributing)
7. [License](#license)

## Overview

The Decentralized Identity System allows users to create and manage their digital identities on the blockchain. It provides functionality for basic identity management, detailed user profiles, and a reputation system.

## Components

### 1. Decentralized Identity Contract (`decentralized_identity.clar`)

This contract handles the core identity functionality:
- Creating a new identity
- Retrieving identity information
- Updating identity details

### 2. User Profile Contract (`user_profile.clar`)

This contract manages more detailed user profile information:
- Setting and updating user profiles
- Retrieving profile information
- Deleting profiles

### 3. Reputation System Contract (`reputation_system.clar`)

This contract implements a basic reputation system:
- Initializing user reputation
- Updating reputation scores
- Retrieving reputation information

## Setup

1. Ensure you have [Clarinet](https://github.com/hirosystems/clarinet) installed.

2. Clone the repository:
   ```
   git clone https://github.com/yourusername/decentralized-identity-system.git
   cd decentralized-identity-system
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Testing

This project uses Vitest for unit testing. To run the tests:

1. Ensure you have the necessary dependencies:
   ```
   npm install --save-dev vitest @clarinet/core
   ```

2. Run the tests:
   ```
   npm test
   ```

## Usage

To interact with the contracts, you can use Clarinet's console or integrate them into a frontend application.

### Example: Creating an Identity

```clarity
(contract-call? .decentralized-identity create-identity "John Doe" "john@example.com")
```

### Example: Setting a User Profile

```clarity
(contract-call? .user-profile set-profile "I'm a blockchain enthusiast" (some "https://example.com/avatar.jpg") (list "https://twitter.com/johndoe"))
```

### Example: Initializing Reputation

```clarity
(contract-call? .reputation-system initialize-reputation tx-sender)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.