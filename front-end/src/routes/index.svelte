<script lang="ts">
	import { onMount } from 'svelte';
	import '../app.css';
	import cryptoDevs from '$lib/assets/0.svg';

	import { Networks } from '$lib/helpers/Networks';
	import {
		checkIfWalletIsConnected,
		connectWallet,
		getNetwork,
		switchNetwork,
		startPresale,
		presaleMint,
		postsaleMint,
		getTotalTokenIdsMinted,
		isPresaleStarted,
		isPresaleEnded
	} from '$lib/services/CryptoDevsService';

	let loading: boolean;
	let account: string;
	let network: string;
	let presaleStarted: boolean;
	let presaleEnded: boolean;
	let tokenIdsMinted: number;
	let isOwner: boolean;

	onMount(async () => {
		loading = true;
		try {
			account = await checkIfWalletIsConnected();
			await switchN();
			presaleStarted = await isPresaleStarted();
			presaleEnded = await isPresaleEnded();
			tokenIdsMinted = await getTotalTokenIdsMinted();
		} catch (error) {
			console.log('onMount Error ', error);
		}
		loading = false;
	});

	const presaleEndedInterval = setInterval(async () => {
		try {
			presaleStarted = await isPresaleStarted();
			if (presaleStarted) {
				presaleEnded = await isPresaleEnded();
				if (presaleEnded) {
					clearInterval(presaleEndedInterval);
				}
			}
		} catch (error) {
            console.log('presaleEndedInterval Error ', error);
        }
	}, 5 * 1000);

	setInterval(async function () {
		try {
			tokenIdsMinted = await getTotalTokenIdsMinted();
		} catch (error) {
            console.log('setInterval Error ', error);
        }
	}, 5 * 1000);

	async function connect() {
		loading = true;
		try {
			account = await connectWallet();
			await switchN();
			presaleStarted = await isPresaleStarted();
			presaleEnded = await isPresaleEnded();
			tokenIdsMinted = await getTotalTokenIdsMinted();
		} catch (error) {
			console.log('connect Error ', error);
		}
		loading = false;
	}

	async function switchN() {
		if (account) {
			network = await getNetwork();
			const rinkebyChainId = '0x4';
			if (network != Networks[rinkebyChainId]) {
				await switchNetwork(rinkebyChainId);
			}
		}
	}
</script>

<div>
	<div class="main">
		<div>
			<h1 class="title">Welcome to Crypto Devs!</h1>
			<div class="description">Its an NFT collection for developers in Crypto.</div>
			<div class="description">
				{tokenIdsMinted}/20 have been minted
			</div>
			{#if account}
				{#if loading}
					<button class="button">Loading...</button>
				{:else if isOwner && !presaleStarted}
					<button class="button" on:click={startPresale}> Start Presale! </button>
				{:else if !presaleStarted}
					<div>
						<div class="description">Presale hasnt started!</div>
					</div>
				{:else if presaleStarted && !presaleEnded}
					<div>
						<div class="description">
							Presale has started!!! If your address is whitelisted, Mint a Crypto Dev 🥳
						</div>
						<button class="button" on:click={presaleMint}> Presale Mint 🚀 </button>
					</div>
				{:else if presaleStarted && presaleEnded}
					<button class="button" on:click={postsaleMint}> Public Mint 🚀 </button>
				{/if}
			{:else}
				<button on:click={connect} class="button"> Connect your wallet </button>
			{/if}
		</div>
		<div>
			<img class="image" alt="" src={cryptoDevs} />
		</div>
	</div>

	<footer class="footer">Made with &#10084; by Crypto Devs</footer>
</div>
