import { Card, CardContent, CardMedia, Icon, Typography } from "@mui/material";
import { Star, BarChart, CalendarMonth } from "@mui/icons-material";
import Link from "next/link";
import { Media, Movie } from "@/defs";

interface Props {
  media: Media;
}

export default function MediaContainer({ media }: Props) {
  return (
    <Link href={`/${media.mediaType}/${media.id}`}>
      <Card
        sx={{
          width: 300,
          "&:hover": {
            boxShadow: 5,
            backgroundColor: "#333",
            cursor: "pointer",
          },
        }}
      >
        <CardMedia
          component="img"
          width={300}
          height={450}
          image={`https://image.tmdb.org/t/p/w500${media.posterPath}`}
          alt={media.title}
        />
        <CardContent
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <Typography variant="h6">{media.title}</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Icon color="warning" sx={{ marginBottom: "4px" }}>
                <Star />
              </Icon>
              <div>
                <Typography variant="body2">
                  {media.rating0to10.toFixed(1)}
                </Typography>
              </div>
            </span>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Icon color="warning" sx={{ marginBottom: "4px" }}>
                <BarChart />
              </Icon>
              <div>
                <Typography variant="body2">{media.popularity}</Typography>
              </div>
            </span>
            <span
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <Icon color="warning" sx={{ marginBottom: "4px" }}>
                <CalendarMonth />
              </Icon>
              <div>
                <Typography variant="body2">{media.releaseDate}</Typography>
              </div>
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
