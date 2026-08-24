import AppTemplateList from "@/components/(app)/pages/(dashboard)/templates/app-template-list";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const AppTemplates = () => {
  return (
    <main className="py-8 px-16 ">
      <Breadcrumb className="mb-8 md:px-8 px-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/app">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Templates</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AppTemplateList hasPremiumAccess={true} />
    </main>
  );
};

export default AppTemplates;
