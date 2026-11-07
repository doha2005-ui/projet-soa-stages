package ma.inpt.soa.service6suivistagesrest.rest;

import ma.inpt.soa.service6suivistagesrest.dao.StageDAO;
import ma.inpt.soa.service6suivistagesrest.entity.Stage;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/stages")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class StageResource {

    private StageDAO dao = new StageDAO();

    @POST
    public Response creerStage(Stage stage) {
        System.out.println("Tentative de création d'un stage...");
        Stage created = dao.creerStage(stage);
        if (created != null) {
            return Response.status(Response.Status.CREATED).entity(created).build();
        }
        return Response.status(Response.Status.BAD_REQUEST)
                .entity("{\"error\": \"Impossible de créer le stage\"}")
                .build();
    }

    @GET
    @Path("/{id}")
    public Response getStage(@PathParam("id") int id) {
        Stage s = dao.getStage(id);
        if (s != null) {
            return Response.ok(s).build();
        }
        return Response.status(Response.Status.NOT_FOUND)
                .entity("{\"error\": \"Stage non trouvé\"}")
                .build();
    }

    @GET
    public Response listerStages() {
        List<Stage> stages = dao.listerStages();
        return Response.ok(stages).build();
    }

    @PATCH
    @Path("/{id}/statut")
    public Response mettreAJourStatut(@PathParam("id") int id, @QueryParam("statut") String nouveauStatut) {
        System.out.println("Mise à jour du statut du stage " + id + " vers : " + nouveauStatut);
        if (dao.mettreAJourStatut(id, nouveauStatut)) {
            return Response.ok("{\"message\": \"Statut mis à jour\"}").build();
        }
        return Response.status(Response.Status.NOT_FOUND)
                .entity("{\"error\": \"Stage non trouvé\"}")
                .build();
    }
}