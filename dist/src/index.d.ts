import { Contract, ethers, Signer } from "ethers";
import type { TypedDataSigner } from "@ethersproject/abstract-signer";
declare const ForwardRequest: {
    name: string;
    type: string;
}[];
export interface DomainDefinition {
    name: string;
    version: string;
    chainId: string;
    verifyingContract: string;
}
export interface ForwardRequestObject {
    value: "string";
    gas: "string";
    nonce: "string";
    from: "string";
    to: "string";
    data: "string";
}
export interface MetaTxTypeData {
    types: {
        ForwardRequest: typeof ForwardRequest;
    };
    domain: DomainDefinition;
}
export default class Wrapper {
    metaTxTypeData: MetaTxTypeData;
    forwarderContract: Contract;
    provider: ethers.providers.Web3Provider;
    constructor(domainDefinition: DomainDefinition, provider: ethers.providers.Web3Provider);
    buildRequest(input: any): Promise<ForwardRequestObject>;
    signMetaTxRequest(signer: Signer & TypedDataSigner, input: ForwardRequestObject): Promise<{
        signature: string;
        request: ForwardRequestObject;
    }>;
}
export {};
//# sourceMappingURL=index.d.ts.map