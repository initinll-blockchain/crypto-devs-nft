export function getTokenMetadata(tokenId:string): object {
  // get the tokenId from the query params
  const tokenName = `Crypto Dev #${tokenId}`;
  // As all the images are uploaded on github, we can extract the images from github directly.
  const image_url = `https://raw.githubusercontent.com/initinll/crypto-devs-nft/fdbe20a982b2add06f24482b154324d6acf16e2e/front-end/src/lib/assets/${tokenId}.svg`;

  const tokenMetadata = {
      name: tokenName,
      description: "Crypto Dev is a collection of developers in crypto",
      image: image_url
  };

  return tokenMetadata;
}