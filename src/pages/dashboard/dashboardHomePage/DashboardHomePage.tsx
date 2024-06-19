// react router dom
import { Link } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import Heading from "../../../components/Heading";
import GoToMakeNewProductsBtn from "../../products/productsPage/components/GoToMakeNewProductsBtn";
import DisplayError from "../../../components/layout/DisplayError";
import SplashScreen from "../../../components/spinners/SplashScreen";
import InsightWrapper from "../../../components/InsightWrapper";
import DashboardSquare, { type DashboardSqaureProps } from "./DashboardSquare";

// utils
import { nanoid } from "@reduxjs/toolkit";
import axios from "../../../utiles/axios";
import colors from "../../../utiles/functions/getAppColors";

// charts.js
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

// icons
import { FaUser, FaListAlt } from "react-icons/fa";
import { BiSolidComponent } from "react-icons/bi";
import { TbHomeCog } from "react-icons/tb";
import { SiBrandfolder } from "react-icons/si";
import { TbCategory } from "react-icons/tb";
import storeWithArrow from "../../../../imgs/strore_with_arrow.svg";

// types
import type { ProductType, ChartDataType } from "../../../utiles/types";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

// fetchers
const getInsightsQueryFn = async () => {
  const endPoints = [
    "/products",
    "/categories",
    "/users",
    "/orders",
    "/brands",
  ];

  const res = (
    await axios.all(
      endPoints.map((point) => axios.get(`dashboard/insights${point}`))
    )
  ).map(({ data, config: { url } }) => ({
    data,
    endPoint: url?.split("/").at(-1),
  }));

  return res;
};

const DashboardHomePage = () => {
  // get insights
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["getInsights"],
    queryFn: getInsightsQueryFn,
  });

  if (isPending) return <SplashScreen>Loading Insights...</SplashScreen>;

  if (isError)
    return (
      <DisplayError
        error={error}
        initMsg="can't get the insights at the moment"
      />
    );

  const extractData = (wantedEndpoint: string) =>
    data.find(({ endPoint }) => endPoint === wantedEndpoint)?.data;

  const squares: DashboardSqaureProps[] = [
    {
      title: "Products",
      Icon: BiSolidComponent,
      path: "/dashboard/products",
      number: extractData("products").all,
      noNum: isError,
    },
    {
      title: "Orders",
      path: "/dashboard/orders",
      Icon: FaListAlt,
      number: extractData("orders").all,
      noNum: isError,
    },
    {
      title: "Users",
      Icon: FaUser,
      path: "/dashboard/users",
      number: extractData("users").all,
      noNum: isError,
    },
  ];

  const nonAnchorSquares = [
    {
      title: "Categories",
      Icon: TbCategory,
      number: extractData("categories").all,
      noNum: isError,
    },
    {
      title: "Brands",
      Icon: SiBrandfolder,
      number: extractData("brands").all,
      noNum: isError,
    },
  ];

  const bestSellChartsData = (): ChartDataType<"bar"> => {
    const bestSellData = extractData("products").bestSell as Pick<
      ProductType,
      "title" | "_id" | "sold"
    >[];

    return {
      labels: bestSellData.map(({ title }) => title),

      datasets: [
        {
          datalabels: {
            backgroundColor: colors(),
            padding: { top: 7 },
          },
          data: bestSellData.map(({ sold }) => sold),
          backgroundColor: colors(),
          hoverBackgroundColor: colors(["--dark-trans"]),
          borderColor: colors(),
          hoverBorderColor: colors(),
          borderWidth: 2,
        },
      ],
    };
  };

  const productsAvilability = (): ChartDataType<"pie"> => {
    const inStock = extractData("products").inStock;
    const outOfStock = extractData("products").outOfStock;

    return {
      labels: ["In Stock", "Out Of Stock"],
      datasets: [
        {
          data: [inStock, outOfStock],
          hoverBorderColor: colors(["--main", "--danger"]),
          backgroundColor: colors(["--main", "--danger"]),
        },
      ],
    };
  };

  const brandsData = (): ChartDataType<"doughnut"> => {
    return {
      labels: Object.keys(extractData("brands").insights),
      datasets: [
        {
          hoverBorderColor: colors(),
          backgroundColor: colors(),
          data: Object.values(extractData("brands").insights),
          datalabels: {
            formatter: (_, args) => {
              const index = args.dataIndex;
              const label = args.chart.data.labels?.[index];
              return label;
            },
            color: ["white", "white", "black"],
            backgroundColor: colors(),
            font: {
              weight: "bold",
              size: 15,
            },
          },
        },
      ],
    };
  };

  const categoriesData = (): ChartDataType<"bar"> => {
    const categoriesData = extractData("categories").insights;

    return {
      labels: Object.keys(categoriesData),

      datasets: [
        {
          datalabels: {
            color: ["white", "white", "black"],
            font: { weight: "bold", size: 20 },
            backgroundColor: colors(),
            padding: { top: 7 },
          },
          backgroundColor: colors(),
          hoverBackgroundColor: colors(["--dark-trans"]),
          data: Object.values(categoriesData),
          borderColor: "transparent",
          borderWidth: 2,
          hoverBorderColor: colors(),
        },
      ],
    };
  };

  const adminsData = (): ChartDataType<"doughnut"> => {
    const usersData = extractData("users");

    return {
      labels: ["Admins", "NonAdmins"],

      datasets: [
        {
          rotation: 270,
          circumference: 180,
          hoverBorderColor: colors(["--dark", "--light"]),
          backgroundColor: colors(["--dark", "--light"]),
          data: Object.values(usersData.insights),
          datalabels: {
            formatter: (_, args) => {
              const index = args.dataIndex;
              const count = args.dataset.data[index];

              return ((count as number) / usersData.all) * 100 + "%";
            },
            backgroundColor: colors(["--dark", "--light"]),
            color: ["white", "black"],
            font: {
              weight: "bold",
              size: 18,
            },
          },
        },
      ],
    };
  };

  return (
    <>
      <Heading>Dashboard</Heading>

      <ul className="dashboard-page-top-btns">
        <li>
          <Link
            title="go back to store home page btn"
            to="/"
            relative="path"
            className="btn back-to-store-btn"
          >
            <img
              src={storeWithArrow}
              width="24px"
              height="24px"
              alt="store with back arrow icon"
            />
            Back To Store
          </Link>
        </li>

        <li>
          <Link
            title="go to home page settings page btn"
            to="/dashboard/homePageSettings"
            relative="path"
            className="btn"
          >
            <TbHomeCog />
            Home Page Settings
          </Link>
        </li>

        <li>
          <GoToMakeNewProductsBtn />
        </li>
      </ul>

      <div className="dashboard-squares-main-holder">
        <ul className="dashboard-squares-list">
          {squares.map((square) => (
            <DashboardSquare {...square} key={nanoid()} />
          ))}
        </ul>

        <ul className="dashboard-squares-list">
          {nonAnchorSquares.map((square) => (
            <DashboardSquare {...square} key={nanoid()} />
          ))}
        </ul>
      </div>

      <ul className="insights-list">
        <InsightWrapper title="Top 5 selling products">
          <Bar
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,

              scales: {
                x: {
                  ticks: {
                    color: colors(["--dark"])[0],
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
                y: {
                  ticks: {
                    color: colors(),
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
              },

              plugins: {
                legend: {
                  display: false,
                },
                datalabels: {
                  color: ["white", "white", "black"],
                  font: {
                    size: 18,
                    weight: "bold",
                  },
                },
              },
            }}
            plugins={[ChartDataLabels]}
            data={bestSellChartsData()}
          />
        </InsightWrapper>

        <InsightWrapper title="Products Availability" diminsion="800px">
          <Pie
            options={{
              maintainAspectRatio: false,

              layout: {
                padding: {
                  top: 40,
                  bottom: 40,
                  right: 40,
                  left: 40,
                },
              },

              plugins: {
                legend: {
                  display: false,
                },
                datalabels: {
                  color: colors(["--dark", "--danger"]),
                  font: {
                    weight: "bold",
                    size: 16,
                  },

                  formatter: (_, args) => {
                    const index = args.dataIndex;
                    return args.chart.data.labels?.[index];
                  },
                  anchor: "end",
                  align: "end",
                },
              },
            }}
            data={productsAvilability()}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            plugins={[ChartDataLabels as any]}
          />
        </InsightWrapper>

        <InsightWrapper title="Most brands has many products">
          <Doughnut
            data={brandsData()}
            options={{
              layout: {
                padding: 25,
              },
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </InsightWrapper>

        <InsightWrapper title="Most categories has many products">
          <Bar
            data={categoriesData()}
            options={{
              scales: {
                y: {
                  ticks: {
                    color: colors(["--dark"])[0],
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
                x: {
                  ticks: {
                    color: colors(),
                    font: {
                      size: 14,
                      weight: "bold",
                    },
                  },
                },
              },

              layout: {
                padding: 25,
              },
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
            }}
          />
        </InsightWrapper>

        <InsightWrapper title="Admins Percentage" diminsion="800px">
          <Doughnut
            data={adminsData()}
            options={{
              aspectRatio: 2,
              maintainAspectRatio: false,
              layout: {
                padding: 15,
              },
            }}
          />
        </InsightWrapper>
      </ul>
    </>
  );
};

export default DashboardHomePage;
