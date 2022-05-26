import { gatherGraphData } from "../data/graphData";
import { useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { gatherMockupGraphData } from "../data/mockupGraphData";
import {
  Box,
  Input,
  Select,
  Stack,
  Spinner,
  Flex,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons'

import * as api from "strateegia-api";
import { CSVLink } from 'react-csv';

export default function Graph() {
  const graphRef = useRef();

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [graphData, setGraphData] = useState({});
  const [selectedProject, setSelectedProject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [nodesCsv, setNodesCsv] = useState([]);
  const [linksCsv, setLinksCsv] = useState([]);


  function handleSelectChange(e) {
    setSelectedProject(e.target.value);
  }

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
        setGraphData(graphData);
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
    // groups: ["project", "map", "divpoint", "question", "comment", "reply", "agreement", "user", "users"]

    const getNodesData = (groupName) => graphData.nodes?.filter(({group}) => group === groupName);
    const getLinksData = () => graphData.links?.map((data) => data);

    function createNodesObj (arr) {
      return arr?.map((data) => {
        return {
          id: data.id,
          group: data.group,
          title: data.title,
          creation: data.createdAt,
          url: data.dashboardUrl,
        }
      });
    }

    function createLinksObj (arr) {
      return arr?.map((data) => {
        return {
          target: data.target,
          source: data.source,
        }
      });
    }

    if (selectedProject) {

      const maps = createNodesObj(getNodesData('map'));
      const divPoints = createNodesObj(getNodesData('divpoint'));
      const questions = createNodesObj(getNodesData('question'));
      const comments = createNodesObj(getNodesData('comment'));
      const replies = createNodesObj(getNodesData('reply'));
      const agreements = createNodesObj(getNodesData('agreement'));

      const links = createLinksObj(getLinksData());

      setNodesCsv(() => [...maps, ...divPoints, ...questions, ...comments, ...replies, ...agreements]);
      setLinksCsv(() => [...links]);
    }
    // console.log
  }, [graphData]);

  useEffect(() => {
    console.log(nodesCsv);
    console.log(linksCsv);
  }, [nodesCsv, links])

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
   
    <Box>
      <Heading as="h3" size="md" p={3}>
        metaverso da jornada
      </Heading>
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
        <>
        </>
      ) : isLoading ? (
        <Flex minH={"100vh"} align={"center"} justify={"center"}>
          <Stack>
            <Spinner size="xl" />
          </Stack>
        </Flex>
      ) : (
        <>
        <Box display='flex' justifyContent='flex-end' m='4px'>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='xs'
              fontSize='14px'
              fontWeight='400'
              bg='#6c757d' 
              color='#fff'
              borderRadius='3px'
              _hover={{bg: '#5C636A'}}
              paddingBottom={'4px'}
              marginRight='4px'  
            >
              csv
            </MenuButton>
            <MenuList 
              size='sm'
              bg='#6c757d' 
              color='#fff'
              minW='40px'
              fontSize='14px'
            >
              <CSVLink data={nodesCsv} filename='strateegia_metaverse_nodes_report-csv.csv' >
                <MenuItem
                  _hover={{bg: '#5C636A'}}
                  _focus={{bg: '#5C636A'}}
                >
                  nodes.csv
                </MenuItem>
              </CSVLink>
              <CSVLink data={linksCsv} filename='strateegia_metaverse_links_report-csv.csv' >
                <MenuItem _hover={{bg: '#5C636A'}}>links.csv</MenuItem>
              </CSVLink>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='xs'
                fontSize='14px'
                fontWeight='400'
                bg='#6c757d' 
                color='#fff'
                borderRadius='3px'
                _hover={{bg: '#5C636A'}}
                paddingBottom={'4px'}>
              json
            </MenuButton>
            <MenuList 
              size='sm'
              bg='#6c757d' 
              color='#fff'
              minW='40px'
              fontSize='14px'
            >
                <MenuItem 
                  _hover={{bg: '#5C636A'}}
                  _focus={{bg: '#5C636A'}}
                  onClick={() => exportJSONData(nodesCsv, 'nodes')}
                >
                  nodes.json
                </MenuItem>
                <MenuItem 
                  _hover={{bg: '#5C636A'}}
                  onClick={() => exportJSONData(linksCsv, 'links')}
                >
                  links.json
                </MenuItem>
            </MenuList>
          </Menu>
          
        </Box>
        <ForceGraph3D
          ref={graphRef}
          graphData={{ nodes, links }}
          nodeColor="color"
          nodeLabel="title"
          nodeVal="size"
          nodeId="id"
          nodeOpacity={1}
          nodeResolution={10}
          d3AlphaDecay={0.005}
          forceEngine="d3"
          // dagMode={'radialout'}
          // onEngineStop={() => graphRef.current.zoomToFit(400)}
        />
        </>
      )}
    </Box>
  );
}

export const exportJSONData = (data, type) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `strateegia_metaverse_${type}_report-json.json`;

  link.click();
}
