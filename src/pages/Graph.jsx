import { gatherGraphData } from "../data/graphData";
import { useEffect, useState, useRef } from "react";
import ForceGraph3D from 'react-force-graph-3d';
import { gatherMockupGraphData } from "../data/mockupGraphData";
import { Box, Input, Select, Stack, Spinner, Flex } from "@chakra-ui/react";
import * as api from "strateegia-api";

export default function Graph() {
  const graphRef = useRef();

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);

  function handleSelectChange(e) {
    setSelectedProject(e.target.value);
  }

  useEffect(() => {
    console.log("selectedProject %o", selectedProject);
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        setIsLoading(true);
        const graphData = await gatherGraphData(accessToken, selectedProject);
        // setGraphData(graphData);
        setNodes([...graphData.nodes]);
        setLinks([...graphData.links]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
    // const graphData = gatherMockupGraphData();
    // setGraphData(graphData);
    // setNodes([...graphData.nodes]);
    // setLinks([...graphData.links]);
    // console.log('graphData');
    // console.log(graphData);
  }, [selectedProject]);

  useEffect(() => {
    async function fetchProjectList() {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const projectList = await api.getAllProjects(accessToken);
        // console.log('projectList: %o', projectList);
        setProjectList(projectList);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProjectList();
  }, []);

  return (
    // <div>
    //   <h1>Debug Graph</h1>
    //   <p>{nodes.length}</p>
    //   <p>{links.length}</p>
    //   <pre>{JSON.stringify(graphData, null, 2)}</pre>
    // </div>
    <Box>
      <Select placeholder="escolha o projeto" onChange={handleSelectChange}>
        {projectList.map((lab) => {
          return lab.projects.map((project) => {
            return (
              <option key={project.id} value={project.id}>
                {lab.lab.name ? lab.lab.name : "public"} - {project.title}
              </option>
            );
          });
        })}
      </Select>
      {/* <Input type="text" placeholder={selectedProject} />
      <Input type="text" placeholder={isLoading ? 'LOADING' : 'NOT LOADING'} /> */}
      {selectedProject === "" ? (
        <></>
      ) : isLoading ? (
        <Flex minH={"100vh"} align={"center"} justify={"center"}>
          <Stack>
            <Spinner size="xl" />
          </Stack>
        </Flex>
      ) : (
        <ForceGraph3D
          ref={graphRef}
          graphData={{ nodes, links }}
          nodeColor="color"
          nodeLabel="title"
          nodeVal="size"
          nodeId="id"
          nodeOpacity={1}
          nodeResolution={10}

          // dagMode={'radialout'}
          // onEngineStop={() => graphRef.current.zoomToFit(400)}
        />
      )}
    </Box>
  );
}
