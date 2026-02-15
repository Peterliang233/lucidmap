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
      </Routes>
    </HashRouter>
  );
}
