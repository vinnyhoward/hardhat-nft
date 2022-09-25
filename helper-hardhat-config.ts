export interface networkConfigItem {
  name?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "localhost",
  },
  // goerli might not work here, so we've left the kovan addresses up as a reference
  5: {
    name: "goerli",
  },
  42: {
    name: "kovan",
  },
};

export const developmentChains = ["hardhat", "localhost"];
