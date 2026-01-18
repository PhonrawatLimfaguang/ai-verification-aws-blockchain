// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AIVerificationRegistryV2Mini {
    enum Modality { TEXT, VIDEO }

    struct Attestation {
        address verifier;
        Modality modality;
        bool isAI;
        uint256 confidence;   // 0..100
        string  fileHash;
        string  modelId;
        string  modelVersion;
        string  reportURI;    // ipfs://CID
        uint256 timestamp;
    }

    address public owner;
    mapping(address => bool) public isVerifier;
    mapping(bytes32 => Attestation[]) private attestations; // key = keccak256(fileHash)

    event VerifierUpdated(address verifier, bool allowed);

    // ลดพารามิเตอร์ของ event ให้สั้นเพื่อเลี่ยง stack
    event Attested(bytes32 indexed key, address indexed verifier, uint8 modality, bool isAI, uint256 confidence, string reportURI);

    modifier onlyOwner { require(msg.sender == owner, "not owner"); _; }
    modifier onlyVerifier { require(isVerifier[msg.sender], "not verifier"); _; }

    constructor() {
        owner = msg.sender;
    }

    function setVerifier(address acc, bool allowed) external onlyOwner {
        isVerifier[acc] = allowed;
        emit VerifierUpdated(acc, allowed);
    }

    function submitAttestation(
        string calldata fileHash,
        Modality modality,
        bool isAI,
        uint256 confidence,
        string calldata modelId,
        string calldata modelVersion,
        string calldata reportURI
    ) external onlyVerifier {
        require(bytes(fileHash).length > 0, "empty hash");
        require(confidence <= 100, "bad confidence");

        bytes32 key = keccak256(abi.encodePacked(fileHash));
        attestations[key].push(Attestation({
            verifier: msg.sender,
            modality: modality,
            isAI: isAI,
            confidence: confidence,
            fileHash: fileHash,
            modelId: modelId,
            modelVersion: modelVersion,
            reportURI: reportURI,
            timestamp: block.timestamp
        }));

        emit Attested(key, msg.sender, uint8(modality), isAI, confidence, reportURI);
    }

    function getAttestationCount(string calldata fileHash) external view returns (uint256) {
        return attestations[keccak256(abi.encodePacked(fileHash))].length;
    }

    // คืนค่าเป็น struct เพื่อลด stack
    function getAttestationByIndex(string calldata fileHash, uint256 idx)
        external view returns (Attestation memory)
    {
        return attestations[keccak256(abi.encodePacked(fileHash))][idx];
    }

    // (ออปชัน) ดึงทั้งหมดในครั้งเดียว
    function getAttestations(string calldata fileHash)
        external view returns (Attestation[] memory)
    {
        return attestations[keccak256(abi.encodePacked(fileHash))];
    }
}
