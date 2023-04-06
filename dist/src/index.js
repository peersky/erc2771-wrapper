var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ethers } from "ethers";
import forwarderABI from "../minimalForwarderAbi.json";
const ForwardRequest = [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "gas", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "data", type: "bytes" },
];
export default class Wrapper {
    constructor(domainDefinition, provider) {
        this.metaTxTypeData = {
            types: {
                ForwardRequest,
            },
            domain: Object.assign({}, domainDefinition),
        };
        this.forwarderContract = new ethers.Contract(domainDefinition.verifyingContract, forwarderABI, provider);
        this.provider = provider;
    }
    buildRequest(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const gasEstimate = yield this.provider.estimateGas({
                to: input.to,
                data: input.data,
                value: ethers.utils.parseEther("0"),
            });
            let nonce = (yield this.forwarderContract.getNonce(input.from)).toString();
            return Object.assign({ value: "0", gas: gasEstimate.toString(), nonce }, input);
        });
    }
    signMetaTxRequest(signer, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield this.buildRequest(input);
            const toSign = Object.assign(Object.assign({}, this.metaTxTypeData), { message: request });
            const signature = yield signer._signTypedData(toSign.domain, toSign.types, Object.assign({}, request));
            return { signature, request };
        });
    }
}
