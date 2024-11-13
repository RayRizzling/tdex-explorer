# TDEX Explorer

![TDEX Explorer Logo](https://github.com/RayRizzling/tdex-explorer/blob/master/public/logo.svg)

## 📑 Table of Contents

1. [About TDEX Explorer](#about-tdex-explorer)
2. [🚀 Key Features](#-key-features)
3. [📄 Changelog](#-changelog)
4. [🔑 Core Functionalities](#-core-functionalities)
   1. [1. Fetching TDEX Data](#1-fetching-tdex-data-)
   2. [2. Displaying and Filtering Provider Data](#2-displaying-and-filtering-provider-data-)
   3. [3. Provider Interaction](#3-provider-interaction-)
   4. [4. Market Balance Management](#4-market-balance-management-)
   5. [5. Customizable Dashboards](#5-customizable-dashboards-)
   6. [6. Asset and Token Tracking](#6-asset-and-token-tracking-)
   7. [7. Decentralized & Self-Hosted](#7-decentralized--self-hosted-)
   8. [8. Data Visualization](#8-data-visualization-)
5. [💻 Getting Started](#-getting-started)
   1. [🛠️ Prerequisites](#%EF%B8%8F-prerequisites)
   2. [🔧 Installation](#-installation)
   3. [📦 Build for Production](#-build-for-production)
6. [⚙️ Technologies Used](%EF%B8%8F-technologies-used)
7. [📚 Documentation](#-documentation)
   1. [Code Documentation Approach](#code-documentation-approach)
8. [🛠️ Contributing](%EF%B8%8F-contributing)
9. [🌍 Community and Support](#-community-and-support)
10. [📄 License](#-license)
11. [Supported by](#supported-by)

---

### About TDEX Explorer

Welcome to **TDEX Explorer**, an open-source initiative designed to foster user-centered development of the TDEX network. This repository serves as a core codebase for building and managing the **TDEX Dashboard**, a user-friendly interface for exploring and interacting with TDEX. 

Our mission with `tdex-explorer` is to empower every user to deploy their own dashboard instance, promoting a decentralized approach without reliance on centralized providers. This means **low-cost deployment** and **self-hosted freedom**—any user can independently host their dashboard, avoiding high server costs or complex infrastructure requirements.

...

## 🚀 Key Features

- **User-Centric Development**: Prioritizes user needs in expanding and interacting with the TDEX ecosystem.
- **Open Access**: Allows anyone to set up, deploy, and maintain their own dashboard instance, providing full control over their data and interactions.
- **Decentralized Operation**: No dependency on centralized service providers, ensuring a cost-effective and scalable solution for all users.

## 📄 Changelog

For a detailed list of all notable changes to this project, please refer to the [CHANGELOG.md](CHANGELOG.md).

## 🔑 Core Functionalities

TDEX Explorer provides a powerful, user-centric interface for interacting with the TDEX network. Below is an overview of the key functionalities that the app supports:

### 1. **Fetching TDEX Data** 🌐
   - The app retrieves data from the TDEX network, including market information, asset data, and provider details.
   - Supports querying live market balances, mempool stats, and other relevant metrics from the TDEX API or liquid network explorers (like esplora).

### 2. **Displaying and Filtering Provider Data** 🔎
   - The dashboard allows users to explore a list of **TDEX providers**, displaying detailed information about each provider.
   - Users can filter providers by various criteria such as market, asset type, or status.
   - **Real-Time Updates**: The app dynamically updates the displayed provider information as data is fetched or updated from the TDEX network.

### 3. **Provider Interaction** 🤝
   - Users can interact with TDEX providers by selecting specific providers and viewing their status, market balances, and recent activity.
   - The interface allows users to easily view relevant data, ensuring seamless interaction with the TDEX ecosystem.

### 4. **Market Balance Management** 📊
   - **Fetching Market Balances**: TDEX Explorer fetches and displays the balances of assets in real-time for various markets.
   - **Market Filters**: Users can filter markets based on criteria such as asset type, market volume, and more to narrow down the information presented.
   - **Statistical Overview**: A comprehensive display of market statistics helps users gain insights into market trends and balances.

### 5. **Customizable Dashboards** 🖥️
   - The app supports **customizable dashboard layouts**, allowing users to organize market data and provider information as per their preferences.
   - Provides a flexible, modular UI where users can add, remove, and resize widgets displaying the most relevant information.

### 6. **Asset and Token Tracking** 💰
   - Users can track the status of various assets and tokens across different TDEX markets.
   - Real-time asset updates provide users with the latest data, including price fluctuations, volume changes, and liquidity metrics.

### 7. **Decentralized & Self-Hosted** 🔒
   - The core functionality ensures that users have full control over their data and interaction with the TDEX network, thanks to a decentralized and self-hosted architecture.
   - There’s **no dependency on centralized providers**, ensuring **low-cost deployment** and scalability for users wishing to host their own instance of the dashboard.

### 8. **Data Visualization** 📉
   - Data from the TDEX network is displayed through a variety of visualizations, including charts and tables, to provide a clear overview of market dynamics and provider activities.
   - Advanced filtering options allow users to customize their views and focus on specific areas of interest, such as a specific provider or market pair.


## 💻 Getting Started

To get up and running, follow these steps to set up a development environment.


### 🛠️ Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed. The legacy code is compatible with Node.js v20.14.0 and npm v10.7.0. Compatibility with other versions might apply but has not been tested.


### 🔧 Installation

1. Clone the repository:
```bash
   git clone https://github.com/RayRizzling/tdex-explorer.git
```


2.
```bash
    cd tdex-explorer
```

3.  
```bash
    npm install
```

4. Start the development server:
```bash
    npm run dev
```

Visit http://localhost:3000 to view the application in the browser.


### 📦 Build for Production
To create a production build, use the following command:
```bash
    npm run build
```

This will compile an optimized build of the app that’s ready to be deployed.

Test the production build with:
```bash
    npm start
```

Visit http://localhost:3000 to view the application (production build) in the browser.

### ⚙️ Technologies Used
🌟 [Next.js](https://nextjs.org/): Fast React-based framework for building server-rendered applications.
🌟 TDEX Basics of True Dex [BOTD](https://dev.tdex.network/docs/latest/specs/index): Integration with TDEX network resources for seamless exploration and interaction.
🌟 [TypeScript](https://www.typescriptlang.org/): Strongly typed JavaScript for more robust code.
🌟 [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for quickly styling the app with a responsive and custom design.
🌟 [Nyxbui](https://nyxbui.design/): A flexible UI component library and framework including framer motion and more.
    - [Nyxbui](https://nyxbui.design/) is built using [Shadcn](https://ui.shadcn.com/) as its core.
🌟   [Aceternity UI](https://ui.aceternity.com/): A design system to create beautiful, responsive, and performant UIs with advanced features and customization options.
    - Combining [Aceternity UI](https://ui.aceternity.com/) and [Nyxbui](https://nyxbui.design/) is a very advanced approach/technique, inexperienced devs should use the basic [Shadcn](https://ui.shadcn.com/) components which are fully compatible with the code base.


### 📚 Documentation

The documentation for this project is fully integrated into the codebase. We have embedded clear, concise comments and code annotations to explain the purpose and functionality of every major section of the code. This ensures that as you work through the code, you can easily follow its logic and understand its structure.

#### Code Documentation Approach

- **Inline Comments**: Each function and key code block is commented to explain its logic.
- **Type Annotations**: Every function, method, and variable uses TypeScript's type annotations to ensure a clear understanding of data structures, function signatures, and return types.
- **Best Practices**: The code follows industry best practices such as SOLID principles, clean code guidelines, and modularity, making it easy to extend and maintain.
- **Code Organization**: We follow a clear structure for our directories and files, separating concerns such as data handling, UI components, and application logic.

We are actively working to formalize and expand this documentation into a more comprehensive guide for users, developers, and contributors. If you need additional information or have any questions about specific parts of the code, feel free to reach out to the community via the [TDEX Telegram group](https://t.me/tdexnetwork).

We welcome contributions that improve documentation clarity, such as tutorials, examples, or explanations of advanced features.


### 🛠️ Contributing

We welcome contributions to improve and expand tdex-explorer. To get started:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a clear description of the change.

Thank you for contributing to the growth of a decentralized future with TDEX!


### 🌍 Community and Support

Join the TDEX community on [Telegram](https://t.me/tdexnetwork) to discuss this project, share feedback, or get support.


### 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE.md) for more information.

---

#### Supported by:
This project is proudly supported [0x41 Labs](https://www.0x41-labs.com)