FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["NeoWeb.sln", "./"]
COPY ["NeoWeb/NeoWeb.csproj", "NeoWeb/"]
COPY ["tools/NeoWeb.AssetBuilder/NeoWeb.AssetBuilder.csproj", "tools/NeoWeb.AssetBuilder/"]
COPY ["NuGet.Config", "./"]
RUN dotnet restore "NeoWeb/NeoWeb.csproj" \
    && dotnet restore "tools/NeoWeb.AssetBuilder/NeoWeb.AssetBuilder.csproj"

COPY . .
RUN dotnet publish "NeoWeb/NeoWeb.csproj" \
    -c Release \
    -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .
COPY scripts/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5005

ENV ASPNETCORE_URLS=http://+:5005
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["/entrypoint.sh"]
