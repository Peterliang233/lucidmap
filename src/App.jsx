import { HashRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing.jsx";
import HomePage from "./pages/Home.jsx";
import BPlusTreePage from "./pages/BPlusTree.jsx";
import OsProcessStates from "./pages/OsProcessStates.jsx";
import OsThreadSync from "./pages/OsThreadSync.jsx";
import OsVirtualMemory from "./pages/OsVirtualMemory.jsx";
import OsMemoryAlloc from "./pages/OsMemoryAlloc.jsx";
import NetworkTcpHandshake from "./pages/NetworkTcpHandshake.jsx";
import NetworkCongestion from "./pages/NetworkCongestion.jsx";
import NetworkHttpEvolution from "./pages/NetworkHttpEvolution.jsx";
import NetworkTlsHandshake from "./pages/NetworkTlsHandshake.jsx";
import DbAcid from "./pages/DbAcid.jsx";
import DbIsolation from "./pages/DbIsolation.jsx";
import DbSqlTuning from "./pages/DbSqlTuning.jsx";
import BackendJvmMemory from "./pages/BackendJvmMemory.jsx";
import BackendCollections from "./pages/BackendCollections.jsx";
import BackendRateLimit from "./pages/BackendRateLimit.jsx";
import BackendCacheConsistency from "./pages/BackendCacheConsistency.jsx";
import AlgoStructures from "./pages/AlgoStructures.jsx";
import AlgoGraphSearch from "./pages/AlgoGraphSearch.jsx";
import AlgoTwoPointers from "./pages/AlgoTwoPointers.jsx";
import AlgoDynamicProgramming from "./pages/AlgoDynamicProgramming.jsx";
import RedisDataTypes from "./pages/RedisDataTypes.jsx";
import RedisPersistence from "./pages/RedisPersistence.jsx";
import RedisReplication from "./pages/RedisReplication.jsx";
import RedisCluster from "./pages/RedisCluster.jsx";
import RedisEviction from "./pages/RedisEviction.jsx";
import MqKafkaCore from "./pages/MqKafkaCore.jsx";
import MqKafkaConsumer from "./pages/MqKafkaConsumer.jsx";
import MqKafkaStorage from "./pages/MqKafkaStorage.jsx";
import MqKafkaElection from "./pages/MqKafkaElection.jsx";
import MqRocketCore from "./pages/MqRocketCore.jsx";
import MqRocketFeatures from "./pages/MqRocketFeatures.jsx";
import AiAgent from "./pages/AiAgent.jsx";
import AiMcp from "./pages/AiMcp.jsx";
import AiFunctionCall from "./pages/AiFunctionCall.jsx";
import AiA2A from "./pages/AiA2A.jsx";
import AiAgentSkill from "./pages/AiAgentSkill.jsx";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<HomePage />} />
        <Route path="/topics/bplus-tree" element={<BPlusTreePage />} />
        <Route path="/topics/os/process-states" element={<OsProcessStates />} />
        <Route path="/topics/os/thread-sync" element={<OsThreadSync />} />
        <Route path="/topics/os/virtual-memory" element={<OsVirtualMemory />} />
        <Route path="/topics/os/memory-alloc" element={<OsMemoryAlloc />} />
        <Route path="/topics/network/tcp-handshake" element={<NetworkTcpHandshake />} />
        <Route path="/topics/network/congestion-control" element={<NetworkCongestion />} />
        <Route path="/topics/network/http-evolution" element={<NetworkHttpEvolution />} />
        <Route path="/topics/network/tls-handshake" element={<NetworkTlsHandshake />} />
        <Route path="/topics/database/acid" element={<DbAcid />} />
        <Route path="/topics/database/isolation" element={<DbIsolation />} />
        <Route path="/topics/database/sql-tuning" element={<DbSqlTuning />} />
        <Route path="/topics/backend/jvm-memory" element={<BackendJvmMemory />} />
        <Route path="/topics/backend/collections" element={<BackendCollections />} />
        <Route path="/topics/backend/rate-limit" element={<BackendRateLimit />} />
        <Route path="/topics/backend/cache-consistency" element={<BackendCacheConsistency />} />
        <Route path="/topics/algorithms/basic-structures" element={<AlgoStructures />} />
        <Route path="/topics/algorithms/graph-search" element={<AlgoGraphSearch />} />
        <Route path="/topics/algorithms/two-pointers" element={<AlgoTwoPointers />} />
        <Route path="/topics/algorithms/dp" element={<AlgoDynamicProgramming />} />
        <Route path="/topics/redis/data-types" element={<RedisDataTypes />} />
        <Route path="/topics/redis/persistence" element={<RedisPersistence />} />
        <Route path="/topics/redis/replication" element={<RedisReplication />} />
        <Route path="/topics/redis/cluster" element={<RedisCluster />} />
        <Route path="/topics/redis/eviction" element={<RedisEviction />} />
        <Route path="/topics/mq/kafka-core" element={<MqKafkaCore />} />
        <Route path="/topics/mq/kafka-consumer" element={<MqKafkaConsumer />} />
        <Route path="/topics/mq/kafka-storage" element={<MqKafkaStorage />} />
        <Route path="/topics/mq/kafka-election" element={<MqKafkaElection />} />
        <Route path="/topics/mq/rocketmq-core" element={<MqRocketCore />} />
        <Route path="/topics/mq/rocketmq-features" element={<MqRocketFeatures />} />
        <Route path="/topics/ai/agent" element={<AiAgent />} />
        <Route path="/topics/ai/mcp" element={<AiMcp />} />
        <Route path="/topics/ai/function-call" element={<AiFunctionCall />} />
        <Route path="/topics/ai/a2a" element={<AiA2A />} />
        <Route path="/topics/ai/agent-skill" element={<AiAgentSkill />} />
      </Routes>
    </HashRouter>
  );
}
