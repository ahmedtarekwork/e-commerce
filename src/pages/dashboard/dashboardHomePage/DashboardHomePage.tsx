// react
import { useEffect } from "react";

// react router dom
import { Link } from "react-router-dom";

// react query
import { useQuery } from "@tanstack/react-query";

// components
import Heading from "../../../components/Heading";
import GoToMakeNewProductsBtn from "../../products/productsPage/components/GoToMakeNewProductsBtn";
import DisplayError from "../../../components/layout/DisplayError";
import InsightWrapper from "../../../components/InsightWrapper";
import Spinner from "../../../components/spinners/Spinner";
import DashboardSquare, { type DashboardSqaureProps } from "./DashboardSquare";

// utils
import { nanoid } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";
import colors from "../../../utils/functions/getAppColors";

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

// SVGs
import storeWithArrow from "../../../../imgs/strore_with_arrow.svg";

// types
import type {
  ProductType,
  ChartDataType,
  CategoryAndBrandType,
} from "../../../utils/types";

// layouts
import AnimatedLayout from "../../../layouts/AnimatedLayout";
import { AnimatePresence } from "framer-motion";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

type InsightsReturnType = {
  orders: { all: number; insights: Record<string, number> };

  products: Record<"all" | "outOfStock" | "inStock", number> & {
    bestSell: ProductType[];
  };

  users: {
    all: number;
    insights: Record<"admins" | "nonAdmins", number>;
  };
} & Record<
  "brands" | "categories",
  {
    all: number;
    insights: Pick<CategoryAndBrandType, "name" | "productsCount">[];
  }
>;

// fetchers
const getInsightsQueryFn = async (): Promise<InsightsReturnType> => {
  return (await axios("dashboard/insights")).data;
};

const dashboardSquaresIDs = Array.from({ length: 5 }).map(() => nanoid());

const DashboardHomePage = () => {
  // get insights
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["getInsights"],
    queryFn: getInsightsQueryFn,
  });

  useEffect(() => {
    const appContainer = document.querySelector(
      ".app-holder > .container"
    ) as HTMLDivElement;

    const cleanAppContainer = () => {
      ["display", "flex-direction"].forEach((prop) =>
        appContainer.style.removeProperty(prop)
      );
    };

    if (appContainer) {
      if (isPending) {
        appContainer.style.cssText = `
          display: flex;
          flex-direction:column;
        `;
      } else cleanAppContainer();

      return () => cleanAppContainer();
    }
  }, [isPending]);

  if (isError) {
    return (
      <DisplayError
        error={error}
        initMsg="can't get the insights at the moment"
      />
    );
  }

  const squares: DashboardSqaureProps[] = [
    {
      title: "Products",
      Icon: BiSolidComponent,
      path: "/dashboard/products",
      number: data?.products?.all || 0,
      noNum: data?.products?.all !== 0 && !data?.products?.all && isError,
    },
    {
      title: "Orders",
      path: "/dashboard/orders",
      Icon: FaListAlt,
      number: data?.orders?.all || 0,
      noNum: data?.orders?.all !== 0 && !data?.orders?.all && isError,
    },
    {
      title: "Users",
      Icon: FaUser,
      path: "/dashboard/users",
      number: data?.users?.all || 0,
      noNum: data?.users?.all !== 0 && !data?.users?.all && isError,
    },
    {
      path: "/dashboard/categories",
      title: "Categories",
      Icon: TbCategory,
      number: data?.categories?.all || 0,
      noNum: data?.categories?.all !== 0 && !data?.categories?.all && isError,
    },
    {
      path: "/dashboard/brands",
      title: "Brands",
      Icon: SiBrandfolder,
      number: data?.brands?.all || 0,
      noNum: data?.brands?.all !== 0 && !data?.brands?.all && isError,
    },
  ];

  const bestSellChartsData = (): ChartDataType<"bar"> => {
    const bestSellData = data?.products.bestSell as Pick<
      ProductType,
      "title" | "_id" | "sold"
    >[];

    return {
      labels: bestSellData?.map(
        ({ title }) =>
          title.slice(0, 18).trim() + (title.length > 18 ? "..." : "")
      ),

      datasets: [
        {
          datalabels: {
            backgroundColor: colors(),
            padding: { top: 7 },
          },
          data: bestSellData?.map(({ sold }) => sold),
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
    const inStock = data?.products.inStock || 0;
    const outOfStock = data?.products.outOfStock || 0;

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
      labels: (data?.brands?.insights || []).map(({ name }) => name),
      datasets: [
        {
          hoverBorderColor: colors(),
          backgroundColor: colors(),
          data: (data?.brands?.insights || []).map(
            ({ productsCount }) => productsCount
          ),
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
    return {
      labels: (data?.categories?.insights || []).map(({ name }) => name),

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
          data: (data?.categories?.insights || []).map(
            ({ productsCount }) => productsCount
          ),
          borderColor: "transparent",
          borderWidth: 2,
          hoverBorderColor: colors(),
        },
      ],
    };
  };

  const adminsData = (): ChartDataType<"doughnut"> => {
    const usersData = data?.users;

    return {
      labels: ["Admins", "NonAdmins"],

      datasets: [
        {
          rotation: 270,
          circumference: 180,
          hoverBorderColor: colors(["--dark", "--light"]),
          backgroundColor: colors(["--dark", "--light"]),
          data: Object.values(usersData?.insights || {}),
          datalabels: {
            formatter: (_, args) => {
              const index = args.dataIndex;
              const count = args.dataset.data[index];

              return ((count as number) / (usersData?.all || 0)) * 100 + "%";
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

  const isShowInsight = <T extends "bar" | "pie" | "doughnut">(
    data: ChartDataType<T>
  ) => {
    return !!(
      data.labels?.length &&
      data.datasets[0].data.length &&
      (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0) > 0
    );
  };

  const showAllInsight = () => {
    return (
      isShowInsight(bestSellChartsData()) &&
      isShowInsight(productsAvilability()) &&
      isShowInsight(brandsData()) &&
      isShowInsight(categoriesData()) &&
      isShowInsight(adminsData())
    );
  };

  return (
    <AnimatedLayout>
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

      <AnimatePresence>
        {isPending ? (
          <AnimatedLayout key="one">
            <Spinner
              holderAttributes={{
                style: {
                  flex: 1,
                  display: "grid",
                  placeContent: "center",
                },
              }}
              content="Loading Insights..."
              fullWidth
            />
          </AnimatedLayout>
        ) : (
          <AnimatedLayout key="two">
            <div className="dashboard-squares-main-holder">
              <ul className="dashboard-squares-list">
                {squares.slice(0, 3).map((square, i) => (
                  <DashboardSquare {...square} key={dashboardSquaresIDs[i]} />
                ))}
              </ul>

              <ul className="dashboard-squares-list">
                {squares.slice(3).map((square, i) => (
                  <DashboardSquare
                    {...square}
                    key={
                      dashboardSquaresIDs[i + (squares.slice(0, 3).length - 1)]
                    }
                  />
                ))}
              </ul>
            </div>

            {showAllInsight() && (
              <ul className="insights-list">
                {isShowInsight(bestSellChartsData()) && (
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
                )}

                {isShowInsight(productsAvilability()) && (
                  <InsightWrapper
                    title="Products Availability"
                    diminsion="800px"
                  >
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
                )}

                {isShowInsight(brandsData()) && (
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
                )}

                {isShowInsight(categoriesData()) && (
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
                )}

                {isShowInsight(adminsData()) && (
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
                )}
              </ul>
            )}
          </AnimatedLayout>
        )}
      </AnimatePresence>
    </AnimatedLayout>
  );
};

export default DashboardHomePage;
