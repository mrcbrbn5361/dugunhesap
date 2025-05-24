"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function ReportsPage() {
  const [selectedEvent, setSelectedEvent] = useState("all")

  const events = [
    { id: "all", name: "Tüm Etkinlikler" },
    { id: "1", name: "Düğün Töreni" },
    { id: "2", name: "Nişan Töreni" },
    { id: "3", name: "Kına Gecesi" },
  ]

  const giftTypeData = [
    { name: "Çeyrek Altın", value: 48600 },
    { name: "Tam Altın", value: 32401 },
    { name: "Bilezik", value: 42000 },
    { name: "Yarım Altın", value: 16200 },
    { name: "Nakit", value: 53575 },
  ]

  const eventData = [
    { name: "Düğün Töreni", altın: 98750, nakit: 26250 },
    { name: "Nişan Töreni", altın: 24300, nakit: 3025 },
    { name: "Kına Gecesi", altın: 16200, nakit: 4300 },
  ]

  const COLORS = ["#FFB900", "#F7931E", "#F15A24", "#D4AF37", "#4CAF50"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Raporlar</h1>
          <p className="text-muted-foreground">Hediyelerinizin detaylı analizini görüntüleyin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" />
            Yazdır
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            İndir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Değer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺152,325.75</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Altın Değeri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺98,750.50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nakit Değeri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺53,575.25</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hediye</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-48">
            <Label htmlFor="event-select" className="mb-2 block">
              Etkinlik Seçin
            </Label>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger id="event-select">
                <SelectValue placeholder="Etkinlik seçin" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="by-type">Hediye Türüne Göre</TabsTrigger>
            <TabsTrigger value="by-event">Etkinliğe Göre</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Hediye Türü Dağılımı</CardTitle>
                  <CardDescription>Hediyelerinizin türlerine göre dağılımı</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={giftTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {giftTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₺${Number(value).toLocaleString("tr-TR")}`, "Değer"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Etkinlik Bazında Değer</CardTitle>
                  <CardDescription>Her etkinliğin toplam değeri</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={eventData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₺${Number(value).toLocaleString("tr-TR")}`} />
                      <Legend />
                      <Bar dataKey="altın" name="Altın" fill="#FFB900" />
                      <Bar dataKey="nakit" name="Nakit" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="by-type">
            <Card>
              <CardHeader>
                <CardTitle>Hediye Türüne Göre Detaylı Analiz</CardTitle>
                <CardDescription>Her hediye türünün toplam değeri ve adedi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-amber-800">Çeyrek Altın</div>
                      <div className="text-2xl font-bold mt-2">₺48,600</div>
                      <div className="text-sm text-muted-foreground mt-1">12 adet</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-amber-800">Tam Altın</div>
                      <div className="text-2xl font-bold mt-2">₺32,401</div>
                      <div className="text-sm text-muted-foreground mt-1">2 adet</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-amber-800">Bilezik</div>
                      <div className="text-2xl font-bold mt-2">₺42,000</div>
                      <div className="text-sm text-muted-foreground mt-1">2 adet</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-amber-800">Yarım Altın</div>
                      <div className="text-2xl font-bold mt-2">₺16,200</div>
                      <div className="text-sm text-muted-foreground mt-1">2 adet</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-lg font-semibold text-green-800">Nakit</div>
                      <div className="text-2xl font-bold mt-2">₺53,575</div>
                      <div className="text-sm text-muted-foreground mt-1">54 adet</div>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={giftTypeData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₺${Number(value).toLocaleString("tr-TR")}`} />
                        <Bar dataKey="value" name="Değer" fill="#FFB900">
                          {giftTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-event">
            <Card>
              <CardHeader>
                <CardTitle>Etkinliğe Göre Detaylı Analiz</CardTitle>
                <CardDescription>Her etkinliğin hediye dağılımı</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-semibold">Düğün Töreni</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Toplam Değer</div>
                          <div className="text-xl font-bold">₺125,000.50</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Hediye Sayısı</div>
                          <div className="text-xl font-bold">42</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Altın Değeri</div>
                          <div className="text-lg font-semibold text-amber-600">₺98,750.50</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Nakit Değeri</div>
                          <div className="text-lg font-semibold text-green-600">₺26,250.00</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-semibold">Nişan Töreni</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Toplam Değer</div>
                          <div className="text-xl font-bold">₺27,325.25</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Hediye Sayısı</div>
                          <div className="text-xl font-bold">18</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Altın Değeri</div>
                          <div className="text-lg font-semibold text-amber-600">₺24,300.00</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Nakit Değeri</div>
                          <div className="text-lg font-semibold text-green-600">₺3,025.25</div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="text-lg font-semibold">Kına Gecesi</div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-sm text-muted-foreground">Toplam Değer</div>
                          <div className="text-xl font-bold">₺20,500.00</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Hediye Sayısı</div>
                          <div className="text-xl font-bold">12</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Altın Değeri</div>
                          <div className="text-lg font-semibold text-amber-600">₺16,200.00</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Nakit Değeri</div>
                          <div className="text-lg font-semibold text-green-600">₺4,300.00</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={eventData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₺${Number(value).toLocaleString("tr-TR")}`} />
                        <Legend />
                        <Bar dataKey="altın" name="Altın" fill="#FFB900" />
                        <Bar dataKey="nakit" name="Nakit" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
