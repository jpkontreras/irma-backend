import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RestaurantLayout from "./Layout";
import Promotions from "./Components/Promotions";
import FixedMenu from "./Components/FixedMenu";
import WeeklyMonthlyPlanner from "./Components/DayMenu";

export default function MenuPromo() {
  const [activeTab, setActiveTab] = React.useState("day");

  const { props, ...rest } = usePage();
  const { promotions = [], categories = [], menu = [] } = props;

  console.log({ props, ...rest });

  return (
    <RestaurantLayout>
      <Card>
        <CardHeader>
          <CardTitle>Menu y Promociones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="day">Menú del dia</TabsTrigger>
                <TabsTrigger value="fixed">Menú fijo</TabsTrigger>
                <TabsTrigger value="promotions">Promociones</TabsTrigger>
              </TabsList>

              <TabsContent value="day">
                <WeeklyMonthlyPlanner />
              </TabsContent>
              <TabsContent value="fixed">
                <FixedMenu />
              </TabsContent>
              <TabsContent value="promotions">
                <Promotions />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </RestaurantLayout>
  );
}
