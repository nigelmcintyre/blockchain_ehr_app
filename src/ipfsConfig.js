import IpfsClient from 'ipfs-http-client';

export const ipfs = IpfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
});
