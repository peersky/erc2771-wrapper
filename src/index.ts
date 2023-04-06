import { Contract, ethers, Signer } from "ethers";
import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import forwarderABI from "../minimalForwarderAbi.json";
const ForwardRequest = [
  { name: "from", type: "address" },
  { name: "to", type: "address" },
  { name: "value", type: "uint256" },
  { name: "gas", type: "uint256" },
  { name: "nonce", type: "uint256" },
  { name: "data", type: "bytes" },
];

interface DomainDefinition {
  name: string;
  version: string;
  chainId: string;
  verifyingContract: string;
}
interface ForwardRequestObject {
  value: "string";
  gas: "string";
  nonce: "string";
  from: "string";
  to: "string";
  data: "string";
}

interface MetaTxTypeData {
  types: { ForwardRequest: typeof ForwardRequest };
  domain: DomainDefinition;
}

export default class Wrapper {
  metaTxTypeData: MetaTxTypeData;
  forwarderContract: Contract;
  provider: ethers.providers.Web3Provider;

  constructor(
    domainDefinition: DomainDefinition,
    provider: ethers.providers.Web3Provider
  ) {
    this.metaTxTypeData = {
      types: {
        ForwardRequest,
      },
      domain: { ...domainDefinition },
    };
    this.forwarderContract = new ethers.Contract(
      domainDefinition.verifyingContract,
      forwarderABI,
      provider
    );
    this.provider = provider;
  }

  async buildRequest(input: any): Promise<ForwardRequestObject> {
    const gasEstimate = await this.provider.estimateGas({
      to: input.to,
      data: input.data,
      value: ethers.utils.parseEther("0"),
    });
    let nonce = (await this.forwarderContract.getNonce(input.from)).toString();
    return { value: "0", gas: gasEstimate.toString(), nonce, ...input };
  }

  async signMetaTxRequest(
    signer: Signer & TypedDataSigner,
    input: ForwardRequestObject
  ) {
    const request = await this.buildRequest(input);
    const toSign = { ...this.metaTxTypeData, message: request };
    const signature = await signer._signTypedData(toSign.domain, toSign.types, {
      ...request,
    });
    return { signature, request };
  }
}
