// components
import InsightWrapper from "../../../../components/InsightWrapper";
import Heading from "../../../../components/Heading";

// types
import type { ChartDataType, ProductType } from "../../../../utils/types";

// charts-js
import { Doughnut } from "react-chartjs-2";
import chartDataLabel from "chartjs-plugin-datalabels";

// utils
import getAppColors from "../../../../utils/functions/getAppColors";

type ProductSoldCountData = Pick<ProductType, "quantity" | "sold">;
type Props = ProductSoldCountData & { isDashboard: boolean };

const soldedUnitsData = ({
  sold,
  quantity,
}: ProductSoldCountData): ChartDataType<"doughnut"> => {
  return {
    labels: ["Solded", "Not Solded"],
    datasets: [
      {
        hoverBorderColor: getAppColors(["--dark"]),
        backgroundColor: getAppColors(["--dark", "--trans"]),
        data: [sold, quantity],
      },
    ],
  };
};

const SingleProductPageSoldedUnits = ({
  quantity,
  sold,
  isDashboard,
}: Props) => {
  if (!isDashboard) return;

  if (!quantity) {
    return (
      <>
        <Heading headingLevel={2}>Solded Units Count</Heading>

        <strong>This Product doesn't have available quantity</strong>
      </>
    );
  }

  return (
    <ul className="single-product-page-insights-list">
      <InsightWrapper title="Solded Units Count" diminsion="900px">
        <Doughnut
          data={soldedUnitsData({ quantity, sold })}
          options={{
            aspectRatio: 2,
            plugins: {
              datalabels: {
                color: ["white", getAppColors(["--dark"])[0]],
                font: {
                  weight: "bold",
                  size: 20,
                },
              },
            },
            maintainAspectRatio: false,
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          plugins={[chartDataLabel as any]}
        />
      </InsightWrapper>
    </ul>
  );
};
export default SingleProductPageSoldedUnits;
