import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './App.scss';
import { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";

const { connect, keyStores, WalletConnection } = nearAPI;

const config = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
};

const App = () => {
    const [walletInstance, setWalletInstance] = useState(undefined);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const initNearInstances = async () => {
            const near = await connect(config);
            const wallet = await new WalletConnection(near);
            setWalletInstance(wallet);
            setUserId(wallet.account().accountId);
        }

        initNearInstances().catch(console.log);
    }, []);

    useEffect(() => {
        if (walletInstance === undefined) {
            return;
        }
        if (walletInstance.isSignedIn()) {
            setIsSignedIn(true);
        } else {
            setIsSignedIn(false);
        }
    }, [walletInstance]);

    const handleAuthUser = async () => {
        if (isSignedIn) {
            walletInstance.signOut();
            setIsSignedIn(false);
        } else {
            await walletInstance.requestSignIn(
                'example-contract.testnet', // contract requesting access
                "Test DApp",
            ).catch(console.log);
        }
    }

    const handleClick = async () => {
        await handleAuthUser();
    }

    return (
        <div className="app">
            <div className="app__container">
                <Typography variant="subtitle1" gutterBottom component="div">
                    { isSignedIn ? `Connected, ${userId}` : 'Connect'}
                </Typography>
                <Button variant="contained" onClick={handleClick}>
                    { isSignedIn ? 'Disconnect' : 'Connect'}
                </Button>
            </div>
        </div>
  );
}

export default App;
