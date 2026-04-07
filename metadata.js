const { createUmi } = require('@metaplex-foundation/umi-bundle-defaults');
const { createMetadataAccountV3 } = require('@metaplex-foundation/mpl-token-metadata');
const { fromWeb3JsKeypair, fromWeb3JsPublicKey } = require('@metaplex-foundation/umi-web3js-adapters');
const { keypairIdentity, publicKey } = require('@metaplex-foundation/umi');
const { Keypair, Connection } = require('@solana/web3.js');
const fs = require('fs');

// 1. Setup Connection and Wallet
const connection = new Connection("https://api.testnet.solana.com", "confirmed");
const umi = createUmi("https://api.testnet.solana.com");

// Load your local Solana CLI keypair
const secretKey = JSON.parse(fs.readFileSync(process.env.HOME + '/.config/solana/id.json'));
const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
const signer = fromWeb3JsKeypair(keypair);
umi.use(keypairIdentity(signer));

async function addMetadata() {
    const mintAddress = new publicKey("BSVEzTTzh6fPrttNVMSRVunfbboQQFTUuVD4U4NWPiBM"); // RNBC Mint Address

    console.log("Adding metadata to:", mintAddress.toString());

    await createMetadataAccountV3(umi, {
        mint: mintAddress,
        mintAuthority: signer,
        data: {
            name: "RNBC (Аренда байков, авто)",
            symbol: "RNBC",
            uri: "https://raw.githubusercontent.com/Baldso/vnsol/main/rnbc.json", // Link to JSON file on GitHub
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        },
        isMutable: true,
        collectionDetails: null,
    }).sendAndConfirm(umi);

    console.log("Metadata successfully attached!");
}

addMetadata().catch(console.error);
