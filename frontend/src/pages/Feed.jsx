import { useEffect, useRef, useState } from "react";
import PostCard from "../components/PostCard";
import Links from "../components/Links";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";
import MiniPostCard from "../components/MiniPostCard";
import { useSelector } from "react-redux";
import Web3 from 'web3';
import { contractABI, contractAddress } from "../contractDetails";
import { ethers } from "ethers";



export default function Feed() {
  const auth = useSelector((state) => state.auth);
  const [tab, setTab] = useState("home");
  const { pathname } = useLocation();
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [posts, setPosts] = useState([]);



  useEffect(() => {
    if (pathname.includes("trending")) {
      setTab("trending");
    }
  }, [pathname]);

  const fetchUserPosts = async (contract, account) => {
    try {
      const posts = await contract.methods.getUserPosts(account).call();
      console.log('posts', posts);
      setPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      window.ethereum.enable().then(accounts => {
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        const myContract = new web3Instance.eth.Contract(contractABI, contractAddress);
        setContract(myContract);
        fetchUserPosts(myContract, accounts[0]);
      }).catch(error => {
        console.error("User denied account access");
      });
    } else {
      alert('MetaMask not detected. Please install MetaMask to use this feature.');
    }
  }, []);

  console.log('postyyxy', Number(posts[1]?.postId));



  return (
    // THings to add
    <div className="feed">
      <main className="feed__main">
        <Sidebar />
        <div className="feed__main__timeline">
          <div className="feed__main__timeline__nav">
            <h1
              className={tab === "home" && "feed__main__timeline__nav__active"}
              onClick={() => setTab("home")}
            >
              Home
            </h1>
            <h1
              className={
                tab === "trending" && "feed__main__timeline__nav__active"
              }
              onClick={() => setTab("trending")}
            >
              Trending
            </h1>
            <h1
              className={
                tab === "rewards" && "feed__main__timeline__nav__active"
              }
              onClick={() => setTab("rewards")}
            >
              Rewards
            </h1>
          </div>
          {tab === "home" && (
            <div className="feed__main__timeline__cards">
              {posts?.map((post) => <PostCard post = {post} />)}
            </div>
          )}

          {tab === "trending" && (
            <div className="feed__main__timeline__cards">
              <PostCard />
              <PostCard />
              <PostCard />
              <PostCard />
            </div>
          )}
{tab === "rewards" && <div className="feed__main__timeline__winners">
<div className="feed__main__timeline__winners__current-winners">
            <div className="feed__main__timeline__winners__current-winners__title">This week's winners</div>
            <div className="feed__main__timeline__winners__current-winners__inner">
            <div className="feed__main__timeline__winners__current-winners__inner__item">
              <div className="feed__main__timeline__winners__current-winners__inner__item__title">
                1
              </div>
              <MiniPostCard />
            </div>
            <div className="feed__main__timeline__winners__current-winners__inner__item">
              <div className="feed__main__timeline__winners__current-winners__inner__item__title">
                2
              </div>
              <MiniPostCard />
            </div>
            <div className="feed__main__timeline__winners__current-winners__inner__item">
              <div className="feed__main__timeline__winners__current-winners__inner__item__title">
                3
              </div>
              <MiniPostCard />
            </div>
            </div>
            
          </div>
          <div className="feed__main__timeline__winners__current-winners feed__main__timeline__winners__past-winners">
            <div className="feed__main__timeline__winners__current-winners__title">Past winners</div>
            <div className="feed__main__timeline__winners__current-winners__inner">
            <div className="feed__main__timeline__winners__current-winners__inner__item">
              
              <MiniPostCard />
            </div>
            <div className="feed__main__timeline__winners__current-winners__inner__item">
              
              <MiniPostCard />
            </div>
            <div className="feed__main__timeline__winners__current-winners__inner__item">
              
              <MiniPostCard />
            </div>
            </div>
            
          </div>
</div>}
          
        </div>

        <Links />
      </main>
    </div>
  );
}
