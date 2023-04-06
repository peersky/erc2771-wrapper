# ERC2771 wrapper

This package allows to wrap a transaction in to a meta tx in compatible with OpenZeppelin MinimalForwarder contract.

## How to use

```javascript
const Wrapper = require("erc2771-wrapper").default;
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wrapper = new Wrapper(
  {
    name: "MinimalForwarder",
    version: "0.0.1",
    chainId: "5",
    verifyingContract: forwarderDeployment.address,
  },
  provider // provider is needed to estimate gas costs of a transaction
);

const metaTx = await wrapper.signMetaTxRequest(this.signer, {
  from: signer.address,
  to: registry.address,
  data: registry.interface.encodeFunctionData("register", [randomName]),
});
```


