import { useEffect, useState } from "react"

export const NFTGallery = () => {
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    const loadNFTs = async () => {
      const response = await fetch("https://api.nftport.xyz/v0/accounts/0x389d212b12618dbdf4b1ff5c4317db5e096f954e?chain=polygon&include=metadata", {
        "method": "GET",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "ab4b8d5f-d0f7-4d98-b0fc-ddd75f4e5da9"
        }
      })
      const result = await response.json();

      setNFTs(result.nfts);

      console.log(result);
    }

    loadNFTs();
  }, [])

  return (
    <div className="bg-white">
      <div className="p-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Your NFT collection</h2>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {nfts.map((nft) => (
            <div key={nft.token_id} className="group relative">
              <div className="w-full min-h-80 bg-white aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={nft.cached_file_url}
                  alt={nft.metadata.name}
                  className="w-full h-full object-center object-contain lg:w-full lg:h-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-lg text-gray-700">
                      {nft.metadata.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{nft.metadata.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}