import { GetFormStats, GetForms, GetMyForms } from "@/actions/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { LuView } from "react-icons/lu";
import { HiCursorClick } from "react-icons/hi";
import { FaWpforms } from "react-icons/fa";
import { TbArrowBounce } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Badge } from "@/components/ui/badge";
import { format, formatDistance, intlFormatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { Form } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ptBR } from 'date-fns/locale'

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

export default function Home() {

  const { userId, sessionClaims } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userRole = sessionClaims?.metadata.role;

  return (
    <>
      {userRole == "admin" ? (
        <div className="container pt-4 pb-20">
          <Suspense fallback={<StatsCards loading={true} />}>
            <CardStatsWrapper />
          </Suspense>
          <Separator className="my-6" />
            <h2 className="text-4xl font-bold col-span-2">Seus Formulários</h2>
          <Separator className="my-6" />
          <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreateFormBtn />
            <Suspense
              fallback={[1, 2, 3, 4].map((el) => (
                <FormCardSkeleton key={el} />
              ))}
            >
              <FormCards />
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="container pt-4 pb-20">
          <Separator className="my-6" />
            <h2 className="text-4xl font-bold col-span-2">Formulários Respondidos</h2>
          <Separator className="my-6" />
          <div className="rounded-md border">
            <UserSubmissionsTable />
          </div>
        </div>
      )}
    </>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

export function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total de Visitas"
        icon={<LuView className="text-blue-600" />}
        helperText="Todas as visitas ao formulário"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />

      <StatsCard
        title="Total de Envios"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="Todos os envios de formulário"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="Taxa de submissão"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visitas que resultaram em submissão de formulário"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="Taxa de Rejeição"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visitas que saíram sem interagir"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}


export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

async function FormCards() {
  const forms = await GetForms();
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate text-wrap font-bold">{form.name}</span>
          {form.published && <Badge>Publicado</Badge>}
          {!form.published && <Badge variant={"destructive"}>Rascunho</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
            locale: ptBR
          })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "Sem descrição"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.id}`}>
              Visualizar envios<BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button asChild variant={"secondary"} className="w-full mt-2 text-md gap-4">
            <Link href={`/builder/${form.id}`}>
              Editar Form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

async function UserSubmissionsTable () {
  const submissions = await GetMyForms();

  const columns: {
      id: string;
      label: string;
      required: boolean;
      type: ElementsType;
  }[] = [];

  const rows: Row[] = [];
  
  submissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      form: submission.form,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead className="text-muted-foreground text-right uppercase">Enviado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            <>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <RowCell key={index} type="TextField" value={row.form.name} />
                  <TableCell className="text-muted-foreground text-right">
                    {formatDistance(row.submittedAt, new Date(), {
                      addSuffix: true,
                      locale: ptBR, 
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <>
              <TableRow>
                  <TableCell>
                    Você ainda não respondeu nenhum formulário!
                  </TableCell>
                </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}